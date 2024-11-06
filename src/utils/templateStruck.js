export const ReceiptTemplate = () => {
    return (
      <div id="receipt" style={{ width: '300px', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
        <h2 style={{ textAlign: 'center' }}>Toko Sukses Selalu</h2>
        <p style={{ textAlign: 'center' }}>Jl. Merdeka No.123, Jakarta</p>
        <p style={{ textAlign: 'center' }}>Tel: 0812-3456-7890</p>
        <hr />
        <p><strong>Date:</strong> 31/10/2024</p>
        <table style={{ width: '100%' }}>
          <tbody>
            <tr>
              <td>Item A</td>
              <td>2 x Rp15.000</td>
              <td>Rp30.000</td>
            </tr>
            <tr>
              <td>Item B</td>
              <td>1 x Rp20.000</td>
              <td>Rp20.000</td>
            </tr>
            <tr>
              <td>Item C</td>
              <td>3 x Rp5.000</td>
              <td>Rp15.000</td>
            </tr>
          </tbody>
        </table>
        <hr />
        <p><strong>Total:</strong> Rp65.000</p>
        <p style={{ textAlign: 'center' }}>Thank you for shopping with us!</p>
      </div>
    );
  };