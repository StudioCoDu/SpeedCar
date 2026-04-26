# Speed Car Google Play Release Checklist

## Current App State
- Android package: `com.ofek.race`
- Display name: `Speed Car`
- Target SDK: API 35
- Build system: Capacitor Android
- Ads: AdMob infrastructure is wired in test mode only
- Backend: Supabase auth and shared leaderboard

## Before Public Release
1. Create a Google Play developer account.
2. Create the `Speed Car` app in Play Console.
3. Create an AdMob app and Android ad units.
4. Replace the test AdMob IDs:
   - `android/app/src/main/res/values/strings.xml`: `admob_app_id`
   - `game.js`: `ADS_CONFIG.interstitialAdId`
   - `game.js`: `ADS_CONFIG.rewardedAdId`
   - Set `ADS_CONFIG.useTestAds` to `false` only after real ad units are approved.
5. Publish `privacy.html` publicly and paste its URL into Play Console.
6. Fill Play Console Data Safety:
   - Email address: collected for account login.
   - User ID: collected for Supabase authentication.
   - App activity / score: best score is stored for the leaderboard.
   - Advertising data: collected once real AdMob ads are enabled.
7. Complete Content Rating questionnaire.
8. Complete Target Audience and Content. If children are included, keep child-directed ad settings enabled and use only family-safe ad categories.
9. Prepare store listing:
   - Short description
   - Full description
   - App icon
   - Feature graphic
   - Phone screenshots
   - Tablet screenshots
10. Build a release App Bundle:
    ```powershell
    npm run android:bundle
    ```
11. Upload `android/app/build/outputs/bundle/release/app-release.aab` to Internal testing first.
12. Test sign in, leaderboard sync, gameplay, layout, and test ads from the Play-installed build.

## Recommended Ad Policy
- Show interstitial ads only after game over, never during driving.
- Keep frequency low: currently one ad every 3 finished games.
- Keep rewarded ads optional if they are added later.
- Use test ads during development. Do not click real ads during testing.
