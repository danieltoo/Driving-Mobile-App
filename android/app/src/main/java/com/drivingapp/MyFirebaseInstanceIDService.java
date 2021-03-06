package com.drivingapp;

import android.util.Log;
import android.content.Context;
import android.content.Intent;
import com.google.firebase.iid.FirebaseInstanceId;
import com.google.firebase.iid.FirebaseInstanceIdService;
import com.facebook.react.HeadlessJsTaskService;


public class MyFirebaseInstanceIDService extends FirebaseInstanceIdService {

    private static final String TAG = "Alertas";
    @Override
    public void onTokenRefresh() { 
        String refreshedToken = FirebaseInstanceId.getInstance().getToken();
        Log.d(TAG, "Refreshed token: " + refreshedToken);
        sendRegistrationToServer(refreshedToken);
    }
    
    private void sendRegistrationToServer(String token) {

        Context context = getApplicationContext();

        Intent serviceIntent = new Intent(context, FCMToken.class);
        serviceIntent.putExtra("FCMToken", token);
        context.startService(serviceIntent);
        HeadlessJsTaskService.acquireWakeLockNow(context);

    }
}