import {PrinterJS} from 'printerjs';
import {html2canvas} from 'html2canvas';
import ReceiptTemplate from './templateStruck'
import React from 'react';
// local usb
export const printDocument = () => { 
    PrinterJS.device();
    PrinterJS.bluetooth({
      content: 'Hello, Printer!',
      type: 'text', // atau 'image' jika kamu ingin mencetak gambar
      printer: 'RPP02N', // Ganti dengan nama printer Bluetooth kamu
    });
  };
export const requestDevice = async () => {
    try {
        const savedDeviceId = localStorage.getItem('bluetoothDeviceId');
        let bluetoothDevice;
  
        // Mencoba untuk menghubungkan ke perangkat yang tersimpan
        if (savedDeviceId) {
          console.log('Trying to reconnect to saved device with ID:', savedDeviceId);
          
          // Cek perangkat yang sudah terhubung
          const devices = await navigator.bluetooth.getDevices();
          bluetoothDevice = devices.find(device => device.id === savedDeviceId);
  
          if (bluetoothDevice) {
            console.log('Reconnecting to saved device:', bluetoothDevice.name);
          } else {
            // Jika tidak menemukan perangkat, minta pengguna untuk memilih perangkat
            bluetoothDevice = await navigator.bluetooth.requestDevice({
              filters: [{ namePrefix: 'RPP02N' }],
            });
            
            localStorage.setItem('bluetoothDeviceId', bluetoothDevice.id);
          }
        } else {
          // Jika tidak ada perangkat tersimpan, minta perangkat baru
          bluetoothDevice = await navigator.bluetooth.requestDevice({
            filters: [{ namePrefix: 'RPP02N' }],
          });
          
          localStorage.setItem('bluetoothDeviceId', bluetoothDevice.id);
        }
  
        // Menghubungkan ke GATT server
        const server = await bluetoothDevice.gatt.connect();
        console.log('GATT server connected:', server);
  
        // Mendapatkan layanan yang tersedia di perangkat
        const service = await server.getPrimaryService('49535343-fe7d-4ae5-8fa9-9fafd205e455');
  
        // Mendapatkan karakteristik yang bisa ditulis pada layanan tersebut
        const characteristics = await service.getCharacteristics();
        const writableCharacteristic = characteristics.find(char => char.properties.write);
  
        if (writableCharacteristic) {
          // Mengirim data ke printer
          const textToPrint = "Hello, Printer!";
          const encoder = new TextEncoder('utf-8');
          const data = encoder.encode(textToPrint);
          await writableCharacteristic.writeValue(data);
          console.log('Data sent to printer successfully');
        } else {
          console.error('No writable characteristic found');
        }
      } catch (error) {
        console.error('Error connecting to device or sending data:', error);
      }
  };
  
  
export async function getPrinterServices() {
    // try {
        let device;
        const isdevice = localStorage.getItem('BT_Device');
        if(!isdevice){
          console.log(navigator.bluetooth);
          
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
  
  