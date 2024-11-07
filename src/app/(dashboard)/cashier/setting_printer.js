export async function getPrinterServices() {
    // try {
        let device;
        const isdevice = localStorage.getItem('BT_Device');
        if(!isdevice){
          console.log(navigator.blue);
          
            device = await navigator.bluetooth.requestDevice({
                filters: [{ 
                  namePrefix: 'RPP02N' 
                  // acceptAllDevices: true

                }],
                 // Ganti dengan nama atau awalan nama printer
                optionalServices: ['49535343-fe7d-4ae5-8fa9-9fafd205e455'] // Kosongkan agar bisa melihat semua layanan
            });
    
            localStorage.setItem('BT_Device', device.id);
        }else{
            const devices = await navigator.bluetooth.getDevices();
            device = devices.find(val => val.id === isdevice);
            if (device.id === isdevice) {
                console.log('Reconnecting to saved device:', device.name);
              } else {
                device = await navigator.bluetooth.requestDevice({
                    filters: [{ namePrefix: 'RPP02N' }], // Ganti dengan nama atau awalan nama printer
                    // optionalServices: ['49535343-fe7d-4ae5-8fa9-9fafd205e455'] // Kosongkan agar bisa melihat semua layanan
                });
                console.log('New device connected:', device.name);
                // Simpan ID perangkat baru jika tidak ada ID yang tersimpan
                localStorage.setItem('BT_Device', device.id);
              }
        }

        // Meminta izin pengguna untuk memilih perangkat Bluetooth


        console.log(`Connected to device: ${device.id}`);
        console.log(device);
    
        // Koneksi ke GATT server
        const server = await device.gatt.connect();
        console.log(server);
        
        // Mendapatkan semua layanan utama
        const services = await server.getPrimaryServices();
        console.log('services', services);

        services.forEach(async (service) => {
          console.log(`Service UUID: ${service.uuid}`);
    
          // Mendapatkan semua karakteristik dalam setiap layanan
          const characteristics = await service.getCharacteristics();
          characteristics.forEach(characteristic => {
            console.log(`Characteristic UUID: ${characteristic.uuid}`);
            
          });
         
        });
        return server;
    //   } catch (error) {
    //     console.error('Error during printing:', error);
    //   }
  }