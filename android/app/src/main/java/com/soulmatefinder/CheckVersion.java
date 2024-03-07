package com.soulmatefinder;

import android.util.Log;
import android.os.Build;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class CheckVersion extends ReactContextBaseJavaModule {

    CheckVersion(ReactApplicationContext context){
        super(context);
    }

    @Override
    public String getName() {
        return "CheckVersion";
    }

    @ReactMethod
    public void getCurrentVersion(Callback callback) {
        boolean isTiramisu = Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU;
        Log.d("UserDeviceVersion:", "Version >= isTiramisu:" + isTiramisu);

        // Pass the boolean value to the callback
        callback.invoke(isTiramisu);
    }
}
