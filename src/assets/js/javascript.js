$(document).ready(function(){
    setInterval(swapImages,1000);
    let repetir =0    
    function swapImages(){
        
        estado= window['chat'].component.notification.nuevo;
        usuario= window['chat'].component.notification.username;
        mensaje= window['chat'].component.notification.texto;
        banio= window['chat'].component.notification.banio;
        console.log('estado:'+estado);
        
        if (estado ==true){
                window['chat'].zone.run(()=>{
                    window['chat'].component.notification.nuevo=false;
                });
                //window['chat'].component.notification.nuevo=false;
                console.log("estadod: "+window['chat'].component.notification.nuevo)
                Push.create(mensaje);
                notificaciones=0;
            
        }
    }

})
