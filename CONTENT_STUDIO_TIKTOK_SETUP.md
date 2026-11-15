# AI PM LAB Content Studio — setup and honest TikTok review

## Purpose
AI PM LAB Content Studio is a public tool for consultants, independent creators and small businesses. The user creates an original five-slide operational story, edits text, inspects 1080x1920 previews, downloads JPEGs and optionally connects their own TikTok account to share the content with explicit per-post approval.
URL: https://aipmlab.propertydex.xyz/content-studio

The existing n8n social publisher and its Google Sheets and Slides are unchanged. This site is a separate creator-facing application rather than a back-office uploader for the project owner's account.

## Already implemented in the repository
- Interactive five-slide workflow story builder, editing and live JPEG preview/download.
- Login Kit authorization-code OAuth, per-login random state, server-side exchange and refresh.
- Server-side TikTok session persistence through Netlify Blobs.
- Creator information/available privacy options, comments permissions, commercial disclosure and consent.
- Server-hosted JPEG URLs on the verified AI PM LAB domain, photo Content Posting API and status check.
- User-initiated disconnect with TikTok token revocation.
- Meaningful unavailable state until TikTok credentials and the redirect are configured.

## Settings required before recording a real TikTok demo
1. Verify Netlify has deployed this repository. GitHub Actions build success does not confirm a Netlify deployment.
2. In the AI PM LAB Netlify project settings, add two private runtime environment variables: TIKTOK_CLIENT_KEY and TIKTOK_CLIENT_SECRET, from the relevant TikTok developer app environment. Never add them to browser code, Google Sheets, GitHub commits or a chat.
3. In TikTok Developers, Sandbox → Login Kit → Web, add the exact callback https://aipmlab.propertydex.xyz/api/studio/callback. This is different from the preexisting n8n OAuth callback. Keep both only if they are actually needed.
4. Ensure Sandbox has Login Kit and Content Posting API, video.publish permission and a registered target TikTok account. Confirm domain verification for pulled photo URLs.
5. Load /api/studio/status. It should say configured:true and connected:false before sign-in.
6. Visit /content-studio, edit a sample, preview five slides and download JPEG 01.
7. Use Connect TikTok to authorize the Sandbox target user. Verify nickname and privacy options are really returned from TikTok.
8. For Sandbox unaudited posting, test with a private account and SELF_ONLY as allowed by TikTok. Select a privacy choice, review commercial/AI disclosures, consent, and submit only one photo carousel.
9. Check the returned publish ID and status. If the API rejects a request, use Netlify function logs, do not claim success.
10. Record the real browser journey and replace the placeholder upload in App Review. TikTok requires a complete end-to-end video; never stage an unimplemented function.
11. Remove the video.upload scope from the app if it is not in use. The Content Studio implementation requests user.info.basic and video.publish only.
12. For app review, ensure the public app name matches the site and does not contain TikTok in the name. TikTok also evaluates whether the service is genuinely available beyond the owner's personal accounts.

## The video story
Open the public site → pick Customer requests → edit real business problem and five-slide workflow → download one JPEG → connect TikTok target user → view creator nickname → manually select allowed privacy → show caption and disclosure options → expressly approve upload → show response and publishing status.

## Limitations
No Netlify environment credentials have been set by this change. OAuth and post submission are not production-verified. TikTok approval is not guaranteed. Unaudited API clients have privacy restrictions, and per-creator daily caps may vary. The current Content Studio requires an explicit review and submission action for every post, rather than unattended n8n scheduling.

## Privacy and operations
TikTok credentials stay server-side. Published image URLs are hard to guess but intentionally public so TikTok can retrieve photos; ask users to avoid sensitive client data. Blob cleanup and lifecycle policy should be added before scaling beyond initial controlled pilots.

Official docs: https://developers.tiktok.com/docs/en/content-sharing-guidelines and https://developers.tiktok.com/docs/en/app-review-guidelines