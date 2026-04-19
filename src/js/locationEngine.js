export function getLocation (){
       return new Promise((resolve, reject) => {
        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        };

        if (!("geolocation" in navigator)) {
            reject(new Error("Geolocation not supported."));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) =>
                resolve(position),
            
            (error) => 
                reject(error),
            options
        )
    })
};
