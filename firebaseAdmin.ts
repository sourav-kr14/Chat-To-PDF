import {initializeApp,getApps,App,getApp,cert} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";
import serviceKey from "../chat-to-pdf/service_key.json";

import {getStorage} from "firebase-admin/storage";




let app:App;
if(getApps().length === 0)
{
    app=initializeApp({
        credential:cert(serviceKey),

    })
}
else
{
    app=getApp();
}
const adminDb=getFirestore(app);
const adminStorage =getStorage(app);
export{app as adminApp,adminDb,adminStorage}