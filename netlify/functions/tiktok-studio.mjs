import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import { getStore } from '@netlify/blobs';

const oauthBase = 'https://open.tiktokapis.com/v2/oauth';
const apiBase = 'https://open.tiktokapis.com/v2/post/publish';
const site = 'https://aipmlab.propertydex.xyz';
const callbackUrl = site + '/api/studio/callback';
const sessionName = 'aipmlab_tiktok_sid';
const oauthName = 'aipmlab_tiktok_state';

const configured = () => Boolean(process.env.TIKTOK_CLIENT_KEY && process.env.TIKTOK_CLIENT_SECRET);
const cookie = (req, name) => {
  const raw = (req.headers.get('cookie') || '').split('; ').find(part => part.startsWith(name + '='));
  return raw ? decodeURIComponent(raw.slice(name.length + 1)) : '';
};
const setCookie = (name, value, seconds) => name + '=' + encodeURIComponent(value) + '; Path=/api/studio; HttpOnly; Secure; SameSite=Lax; Max-Age=' + seconds;
const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers}});
const err = (message, status = 400) => json({error:message}, status);
const sessions = () => getStore('aipmlab-tiktok-sessions');
const images = () => getStore('aipmlab-tiktok-photo-assets');
const tokenForm = (data) => new URLSearchParams({client_key:process.env.TIKTOK_CLIENT_KEY,client_secret:process.env.TIKTOK_CLIENT_SECRET,...data});
async function tokenRequest(data) {
  const response=await fetch(oauthBase + '/token/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:tokenForm(data)});
  const value=await response.json().catch(()=>({}));
  if(!response.ok || !value.access_token) throw new Error(value.error_description || value.error || 'TikTok authorization failed.');
  return value;
}
async function loadSession(req) {
  const sid = cookie(req,sessionName);
  if(!/^[a-f0-9]{48}$/.test(sid)) return null;
  const value=await sessions().get('s-'+sid,{type:'text'});
  if(!value) return null;
  const record=JSON.parse(value);
  if(!record.access_token || !record.refresh_token || !record.open_id) return null;
  if(Date.now() > record.accessExpiresAt - 120000) {
    const renewed=await tokenRequest({grant_type:'refresh_token',refresh_token:record.refresh_token});
    record.access_token=renewed.access_token;record.refresh_token=renewed.refresh_token;
    record.scope=renewed.scope;record.accessExpiresAt=Date.now() + renewed.expires_in*1000;
    await sessions().set('s-'+sid,JSON.stringify(record));
  }
  return {sid,record};
}
async function tiktokCall(path,access_token,body) {
  const response=await fetch(apiBase + path,{
    method:'POST',
    headers:{Authorization:'Bearer '+access_token,'Content-Type':'application/json; charset=UTF-8'},
    body:JSON.stringify(body)
  });
  const result=await response.json().catch(()=>({}));
  const status=result.error?.code || (response.ok?'ok':'request_error');
  if(!response.ok || status!=='ok') {
    const ex=new Error(result.error?.message || 'TikTok API request failed ('+status+').');
    ex.code=status; throw ex;
  }
  return result.data||{};
}
const normalizedCreator = (data) => ({
  nickname:data.creator_nickname || 'TikTok creator',
  username:data.creator_username || '',
  avatarUrl:data.creator_avatar_url || '',
  privacyOptions:Array.isArray(data.privacy_level_options) ? data.privacy_level_options : [],
  commentDisabled: Boolean(data.comment_disabled),
  canPost:data.can_post!==false
});
async function handler(req) {
  const url=new URL(req.url),action=url.searchParams.get('action')||'';
  if(action==='image' && req.method==='GET') {
    const id=url.searchParams.get('id')||'';
    if(!/^[a-f0-9-]{36}$/.test(id))return err('Invalid image reference.',404);
    const blob=await images().get('img-'+id,{type:'arrayBuffer'});
    if(!blob)return err('Image not found.',404);
    return new Response(blob,{status:200,headers:{'Content-Type':'image/jpeg','Cache-Control':'public, max-age=3600','X-Content-Type-Options':'nosniff','Access-Control-Allow-Origin':'*'}});
  }
  if(action==='status' && req.method==='GET') {
    if(!configured()) return json({configured:false,connected:false});
    try{const session=await loadSession(req);return json({configured:true,connected:!!session});}
    catch {return json({configured:true,connected:false});}
  }
  if(!configured()) return err('TikTok integration is not yet configured on this website.',503);
  if(action==='start' && req.method==='GET') {
    const state=randomBytes(32).toString('hex');
    const auth=new URL('https://www.tiktok.com/v2/auth/authorize/');
    auth.searchParams.set('client_key',process.env.TIKTOK_CLIENT_KEY);
    auth.searchParams.set('response_type','code');
    auth.searchParams.set('redirect_uri',callbackUrl);
    auth.searchParams.set('scope','user.info.basic,video.publish');
    auth.searchParams.set('state',state);
    return new Response(null,{status:302,headers:{Location:auth.toString(),'Set-Cookie':setCookie(oauthName,state,600),'Cache-Control':'no-store'}});
  }
  if(action==='callback' && req.method==='GET') {
    const state=url.searchParams.get('state')||'', expected=cookie(req,oauthName);
    const validState=/^[a-f0-9]{64}$/.test(state) && expected.length===state.length && timingSafeEqual(Buffer.from(state),Buffer.from(expected));
    if(!validState) return err('Authorization state did not match. Please restart TikTok sign-in.',403);
    if(url.searchParams.get('error')) return err('TikTok authorization was cancelled or declined.',403);
    const code=url.searchParams.get('code');
    if(!code)return err('TikTok did not return an authorization code.',400);
    const token=await tokenRequest({code,grant_type:'authorization_code',redirect_uri:callbackUrl});
    const sid=randomBytes(24).toString('hex');
    const record={
      access_token:token.access_token, refresh_token:token.refresh_token, open_id:token.open_id,
      scope:token.scope, accessExpiresAt:Date.now()+token.expires_in*1000, publishIds:[]
    };
    await sessions().set('s-'+sid,JSON.stringify(record));
    const headers=new Headers({Location:site+'/content-studio?connected=1','Cache-Control':'no-store'});
    headers.append('Set-Cookie',setCookie(sessionName,sid,86400*7));
    headers.append('Set-Cookie',setCookie(oauthName,'',0));
    return new Response(null,{status:302,headers});
  }
  if(action==='creator' && req.method==='GET') {
    const session=await loadSession(req);
    if(!session)return err('Connect a TikTok account to continue.',401);
    const data=await tiktokCall('/creator_info/query/',session.record.access_token,{});
    return json(normalizedCreator(data));
  }
  if(action==='publish-status' && req.method==='GET') {
    const session=await loadSession(req);
    if(!session)return err('TikTok session expired.',401);
    const id=url.searchParams.get('id')||'';
    if(!session.record.publishIds?.includes(id))return err('Unknown publishing reference.',403);
    const data=await tiktokCall('/status/fetch/',session.record.access_token,{publish_id:id});
    return json({status:data.status||'PROCESSING_UPLOAD',failReason:data.fail_reason||null});
  }
  if(req.method==='POST'){
    const origin=req.headers.get('origin');
    if(origin && origin!==site && origin!==new URL(req.url).origin)return err('Cross-origin request blocked.',403);
    if(req.headers.get('x-studio-request')!=='1')return err('Missing request confirmation header.',403);
  }
  if(action==='disconnect' && req.method==='POST') {
    const session=await loadSession(req);
    if(session){
      const response=await fetch(oauthBase+'/revoke/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:tokenForm({token:session.record.access_token})});
      if(!response.ok)return err('Unable to revoke access. Retry or revoke it in TikTok account settings.',502);
      await sessions().delete('s-'+session.sid);
    }
    return json({disconnected:true},200,{'Set-Cookie':setCookie(sessionName,'',0)});
  }
  if(action==='post' && req.method==='POST') {
    const session=await loadSession(req);
    if(!session)return err('Connect your TikTok account first.',401);
    if(!String(session.record.scope||'').split(',').includes('video.publish'))return err('TikTok did not authorize video.publish. Reconnect and grant this permission.',403);
    const len=Number(req.headers.get('content-length')||0);
    if(len>5_000_000)return err('Carousels must be under 5 MB total.',413);
    const body=await req.json().catch(()=>null);
    if(!body||body.consent!==true)return err('You must expressly approve this upload.',400);
    const {title,caption,privacy,commercial,ownBrand,paidBrand,comments,aiGenerated}=body;
    if(typeof title!=='string'||!title.trim()||title.length>90||typeof caption!=='string'||!caption.trim()||caption.length>4000)return err('Invalid post title or caption.',400);
    const source=body.images;
    if(!Array.isArray(source)||source.length!==5)return err('Exactly five JPEG images are required.',400);
    if(commercial && !ownBrand && !paidBrand)return err('Specify the type of promotional content.',400);
    if(paidBrand && privacy==='SELF_ONLY')return err('Branded partnerships cannot be published privately.',400);
    const creator=normalizedCreator(await tiktokCall('/creator_info/query/',session.record.access_token,{}));
    if(!creator.canPost)return err('TikTok does not allow this creator to make more posts right now.',429);
    if(!creator.privacyOptions.includes(privacy))return err('Choose a privacy option available for this TikTok account.',400);
    if(comments && creator.commentDisabled)return err('Comments are disabled for this TikTok account.',400);
    const encoded=[];
    for(const item of source) {
      if(typeof item!=='string'||!item.startsWith('data:image/jpeg;base64,'))return err('Only JPEG images are accepted.',400);
      const jpg=Buffer.from(item.substring('data:image/jpeg;base64,'.length),'base64');
      if(jpg.length<100||jpg.length>900000||jpg[0]!==0xff||jpg[1]!==0xd8||jpg[2]!==0xff)return err('Each JPEG must be valid and under 900 KB.',400);
      encoded.push(jpg);
    }
    const photoUrls=[];
    for(const bytes of encoded){
      const id=randomUUID();
      await images().set('img-'+id,bytes);
      photoUrls.push(site+'/api/studio/image?id='+id);
    }
    const postInfo={
      title:title.trim(),description:caption.trim(),privacy_level:privacy,
      disable_comment:!Boolean(comments),auto_add_music:false,
      brand_organic_toggle:Boolean(commercial&&ownBrand),brand_content_toggle:Boolean(commercial&&paidBrand)
    };
    const result=await tiktokCall('/content/init/',session.record.access_token,{
      media_type:'PHOTO',post_mode:'DIRECT_POST',
      post_info:postInfo,
      source_info:{source:'PULL_FROM_URL',photo_images:photoUrls,photo_cover_index:0},
      is_aigc:Boolean(aiGenerated)
    });
    if(!result.publish_id)return err('TikTok did not provide a publishing reference.',502);
    session.record.publishIds=(session.record.publishIds||[]).slice(-29).concat(result.publish_id);
    await sessions().set('s-'+session.sid,JSON.stringify(session.record));
    return json({publishId:result.publish_id,status:'SUBMITTED'});
  }
  return err('Unknown studio action.',404);
}
export default async (request) => {
  try{return await handler(request);}
  catch(error){console.error('TikTok Studio request failed:',error?.code||error?.message||'unknown');return err('TikTok operation failed: '+String(error?.message||'Internal server error').slice(0,220),502);}
};
