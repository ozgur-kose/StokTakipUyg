import React, { useState, useEffect } from 'react';
import { Modal, Button, Table, message } from 'antd';
import Api from '../Api/Api.js'; // API servisinizi import edin

const Report = () => {
  const [products, setProducts] = useState([]);  // Ürünlerin depolanacağı state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productHistory, setProductHistory] = useState('');  // Ürün geçmişi
  const [messageApi, contextHolder] = message.useMessage();

  // API'den ürünleri çekmek için useEffect
  useEffect(() => {
    Api.getAll()
      .then((data) => {
        console.log(data);  // Veriyi konsola yazdırıyoruz
        if (data && data.data) {
          setProducts(data.data);  // Veriyi state'e atıyoruz
        }
      })
      .catch((error) => {
        console.error('Veri çekilirken bir hata oluştu:', error);
      });
  }, []);  // useEffect sadece component mount olduğunda çalışır

  const showModal = (product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
    // Ürün geçmişini API'den çekiyoruz
    fetchProductHistory(product.row_id);
  };

  const fetchProductHistory = (productId) => {
    // Ürün geçmişi için API çağrısı yapın (örneğin, 'productHistory' endpoint'i)
    // Bu sadece örnek bir API çağrısıdır, kendi API'nize göre değiştirebilirsiniz.
    Api.getProductHistory(productId)
      .then((historyData) => {
        setProductHistory(historyData);  // Geçmiş verisini state'e atıyoruz
      })
      .catch((error) => {
        console.error('Ürün geçmişi alınırken hata oluştu:', error);
        setProductHistory('Geçmiş bilgileri alınamadı.');
      });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedProduct(null);
    setProductHistory('');  // Modal kapandığında geçmişi sıfırla
  };

  const handleSendMail = () => {
    setIsModalVisible(false);
    messageApi.open({
      type: 'success',
      content: `${selectedProduct?.urunAdi} adlı ürünün raporu e-posta ile gönderildi.`,
    });
  };

  // Dinamik rapor metni
  const generateReportText = () => {
    if (!selectedProduct) return 'Ürün bilgisi bulunamadı.';

  
    const { model, urunAdi, marka, satisFiyati, urunKodu, uretici } = selectedProduct;

    return `
      Raporunu oluşturduğum ${model} model ürün, bugün itibariyle stoklara geçmiştir.
      Ürün adı: ${urunAdi}
      Ürün Kodu: ${urunKodu}
      Marka: ${marka}
      Üretici: ${uretici}
      Satış Fiyatı: ${satisFiyati} TL

      Bu ürün, ${marka} markasının en yeni modelidir ve piyasada büyük bir talep görmektedir.
      Ürün, ${uretici} tarafından üretilmiştir ve kullanıcılarına kaliteli bir deneyim sunmayı hedeflemektedir.
    `;
  };

  const columns = [
    {
      title: 'Ürün Adı',
      dataIndex: 'urunAdi',  // Verinin "urunAdi" alanını kullanıyoruz
      key: 'urunAdi',  // "key" ekliyoruz
      render: (text, record) => (
        <a onClick={() => showModal(record)}>{text}</a>
      ),
    },
    {
      title: 'Ürün Kodu',
      dataIndex: 'urunKodu',  // Verinin "urunKodu" alanını kullanıyoruz
      key: 'urunKodu',
    },

  ];

  return (
    <div style={{ padding: 24 }}>
      {contextHolder}
      <h2>Ürün Raporları</h2>
      <Table
        dataSource={products}
        columns={columns}
        rowKey="row_id"  
        pagination={false}
      />

      <Modal
        title={`${selectedProduct?.urunAdi || ''} Raporu`}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Kapat
          </Button>,
          <Button key="send" type="primary" onClick={handleSendMail}>
            Mail Gönder
          </Button>,
        ]}
      >
        {selectedProduct && (
          <div>
            <p><strong>Ürün Kodu:</strong> {selectedProduct.urunKodu}</p>
            <p><strong>Ürün Adı:</strong> {selectedProduct.urunAdi}</p>
            <p><strong>Üretici Kodu:</strong> {selectedProduct.ureticiKodu}</p>
            <p><strong>Barkod Kodu:</strong> {selectedProduct.barkodKodu}</p>
            <p><strong>Üretici:</strong> {selectedProduct.uretici}</p>
            <p><strong>Ürün Tipi:</strong> {selectedProduct.urunTip}</p>
            <p><strong>Marka:</strong> {selectedProduct.marka}</p>
            <p><strong>Model:</strong> {selectedProduct.model}</p>
            <p><strong>Birim:</strong> {selectedProduct.birim}</p>
            <p><strong>Alış Fiyatı:</strong> {selectedProduct.alisFiyati}</p>
            <p><strong>Satış Fiyatı:</strong> {selectedProduct.satisFiyati}</p>
            <p><strong>Rapor:</strong> {generateReportText()}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Report;
