# HAGO - Secure Messenger (Android Build)

This project contains the source code for the HAGO Secure Messenger application and the necessary configuration to build it as a native Android APK.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1.  **[Node.js and npm](https://nodejs.org/)**: Required to install project dependencies and run scripts.
2.  **[Android Studio](https://developer.android.com/studio)**: The official IDE for Android app development. You'll need it to build the final APK. Make sure you have the Android SDK installed via Android Studio.

## How to Build the APK

Follow these steps to generate a signed APK that can be installed on an Android device.

### Step 1: Install Dependencies

Open your terminal or command prompt, navigate to the root directory of this project, and run the following command to install the required Capacitor packages:

```bash
npm install
```

### Step 2: Sync Web Assets with Android Project

After the installation is complete, you need to sync your web application files with the native Android project. This command updates the Android project with your latest web code.

```bash
npx capacitor sync android
```

### Step 3: Open the Project in Android Studio

Now, open the native Android project in Android Studio using the Capacitor CLI:

```bash
npx capacitor open android
```

This will launch Android Studio and load the `android` folder as a project. Wait for Gradle to sync and build the project.

### Step 4: Generate the Signed APK

Once the project is open and synced in Android Studio, you can generate the APK.

1.  In the Android Studio menu bar, go to **Build** -> **Generate Signed Bundle / APK...**.
2.  A dialog will appear. Select **APK** and click **Next**.
3.  You will be prompted to create or use a **Keystore**.
    *   **If you don't have a Keystore:** Click **Create new...** and fill in the required information (key store path, password, alias, key password). Remember this information, as you will need it to publish future updates.
    *   **If you already have a Keystore:** Click **Choose existing...** and locate your keystore file, then enter the passwords.
4.  After configuring the keystore, click **Next**.
5.  Choose a destination folder for the generated APK. For **Build Variants**, select **release**.
6.  Click **Finish**.

Android Studio will now build your application. Once it's done, you'll see a notification in the bottom-right corner with a "Locate" link. Click it to find your signed `app-release.apk` file, ready for distribution.
