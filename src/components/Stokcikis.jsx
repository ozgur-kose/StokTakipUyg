import React, { useState } from 'react';
import { Button, Input, Form, notification,message} from 'antd';
import Api from '../Api/Api'; 
import './StokCikis.css';
import { useContext } from 'react';
import { StockContext } from '../components/StockContext'; 


const StokCikis = () => {
  const { incrementExit } = useContext(StockContext); // StokContext'ten gerekli değerleri al
  const [urunKodu, setUrunKodu] = useState('');
  const [adet, setAdet] = useState('');
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async () => {
    if (!urunKodu || !adet) {
      messageApi.open({
        type: 'error',
        content: 'Lütfen tüm alanları doldurun!',
      });
      return;
    }

    try {
        const response = await Api.getAll();
        const products = response.data;
        
        // Ürün koduna göre ürünü bul
        const productIndex = products.findIndex((p) => p.urunKodu === urunKodu);
        
        if (productIndex === -1) {
          messageApi.open({
            type: 'error',
            content: 'Ürün bulunamadı!',
          });
          return;
        }
        
        const selectedProduct = products[productIndex];
        const mevcutStok = parseInt(selectedProduct.birim || '0', 10);
        const cikisAdedi = parseInt(adet, 10);
        
        if (cikisAdedi > mevcutStok) {
          messageApi.open({
            type: 'error',
            content: `Sadece ${mevcutStok} adet ürün mevcut.`,
          });
          return;
        }
        
        // Yeni stok
        const yeniStok = mevcutStok - cikisAdedi;
        
        
        const row_id = productIndex + 2;
        
        const guncellenmisSatir = {
          ...selectedProduct,
          birim: yeniStok.toString(),
          row_id: row_id.toString(), 
        };
        
        await Api.update(selectedProduct.row_id, guncellenmisSatir);
        incrementExit(); 



      messageApi.open({
        type: 'Success',
        content: `${urunKodu} kodlu üründen ${adet} adet çıkış yapıldı. Yeni stok: ${yeniStok}`,
      });

      // Formu sıfırla
      setUrunKodu('');
      setAdet('');
    } catch (error) {
      console.error(error);
      messageApi.open({
        type: 'error',
        content: 'Stok çıkışı sırasında bir hata oluştu.',
      });
    }
  };

  return (
    <div style={{ padding: '24px', background: '#fff', minHeight: '360px' }}>
        {contextHolder}
      <h2>Stok Çıkışı</h2>
      <Form layout="vertical">
        <Form.Item label="Ürün Kodu">
          <Input
            value={urunKodu}
            onChange={(e) => setUrunKodu(e.target.value)}
            placeholder="Ürün kodunu girin"
          />
        </Form.Item>

        <Form.Item label="Çıkış Adedi">
          <Input
            type="number"
            value={adet}
            onChange={(e) => setAdet(e.target.value)}
            placeholder="Miktar girin"
          />
        </Form.Item>

        <Button type="primary" onClick={handleSubmit}>
          Stok Çıkışı Yap
        </Button>
      </Form>
    </div>
  );
};

export default StokCikis;
