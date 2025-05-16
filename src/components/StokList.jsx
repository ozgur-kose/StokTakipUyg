import React, { useState, useEffect } from 'react';
import { Table, Modal, Input } from 'antd';
import './StokList.css'; // CSS dosyasını import et
import Api from '../Api/Api.js'; // API servisimiz

const { Column } = Table;

const StokList = ({ filters }) => {
  
      const [data, setData] = useState([]);
      const [filteredData, setFilteredData] = useState([]);
      const [selectedRowKeys, setSelectedRowKeys] = useState([]);
      const [isModalVisible, setIsModalVisible] = useState(false);
      const [currentProduct, setCurrentProduct] = useState(null);
      const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProducts = await Api.getAll();
        const enrichedData = allProducts.data.map((item, index) => ({
          row_id: index + 2,
          ...item,
        }));
        setData(enrichedData);
        setFilteredData(enrichedData); 
      } catch (error) {
        console.error("Veri çekme hatası: ", error);
      }
    };

    fetchData();
  }, []);

  
  useEffect(() => {
    if (!data || data.length === 0) return;

    const result = data.filter((item) => {
      return Object.entries(filters).every(([key, value]) => {
        return value === '' || (item[key] && item[key].toLowerCase().includes(value.toLowerCase()));
      });
    });

    console.log("Filtrelenmiş veri:", result);
    setFilteredData(result);
  }, [filters, data]);


  // Modal'daki 'Kaydet' butonunun tıklanması
  const handleModalOk = async () => {
    if (currentProduct) {
      const { row_id, ...updatedData } = currentProduct;
      try {
        await Api.update(row_id, updatedData);
        const updatedDataState = data.map(item =>
          item.row_id === row_id ? { ...item, ...updatedData } : item
        );
        setData(updatedDataState);
        console.log("Güncellenen veri:", updatedDataState);
        setIsModalVisible(false);
      } catch (error) {
        console.error("Güncelleme hatası:", error);
      }
    }
  };
  
  

  // Modal'daki 'İptal' butonunun tıklanması
  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  // Input değeri değiştiğinde currentProduct'ı güncelle
  const handleInputChange = (e, field) => {
    const { value } = e.target;
    setCurrentProduct(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  // Seçilen satırı güncelleme
  const handleUpdate = () => {
    const selectedProduct = data.find(item => selectedRowKeys.includes(item.row_id));
    setCurrentProduct({ ...selectedProduct });
    setIsModalVisible(true);
  };

  // Silme işlemi
  const handleDelete = () => {
    if (selectedRowKeys.length === 0) return;
    setIsDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map(rowId => Api.delete(rowId))
      );
      const updated = data.filter(item => !selectedRowKeys.includes(item.row_id));
      setData(updated);
      setSelectedRowKeys([]);
      setIsDeleteModalVisible(false);
    } catch (error) {
      console.error("Silme hatası:", error);
      setIsDeleteModalVisible(false);
    }
  };
  
  
  

  return (
    <div className="custom-table-container">
      {data.length > 0 ? (
        <>
          <Table
            dataSource={filteredData}
            rowKey={record => record.row_id || record.urunKodu}
            bordered
            pagination={{ pageSize: 5 }}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedKeys) => setSelectedRowKeys(selectedKeys),
            }}
          >
            <Column title="Ürün Kodu" dataIndex="urunKodu" key="urunKodu" />
            <Column title="Ürün Adı" dataIndex="urunAdi" key="urunAdi" />
            <Column title="Üretici Kodu" dataIndex="ureticiKodu" key="ureticiKodu" />
            <Column title="Barkod" dataIndex="barkodKodu" key="barkodKodu" />
            <Column title="Birim" dataIndex="birim" key="birim" />
            <Column title="Üretici" dataIndex="uretici" key="uretici" />
            <Column title="Ürün Tip" dataIndex="urunTip" key="urunTip" />
            <Column title="Marka" dataIndex="marka" key="marka" />
            <Column title="Model" dataIndex="model" key="model" />
            <Column title="Alış Fiyatı (₺)" dataIndex="alisFiyati" key="alisFiyati" />
            <Column title="Satış Fiyatı (₺)" dataIndex="satisFiyati" key="satisFiyati" />
          </Table>

          <div className="button-container">
            <button className="update-product-button" disabled={selectedRowKeys.length !== 1} onClick={handleUpdate}>
              Güncelle
            </button>
            <button className="delete-product-button"  onClick={handleDelete}>
              Sil
            </button>
          </div>

          {/* Modal Güncelleme */}
          <Modal
            title="Ürün Güncelle"
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            okText="Kaydet"
            cancelText="İptal"
          >
            {currentProduct && (
              <>
                <div>
                  <label>Ürün Kodu</label>
                  <Input 
                    value={currentProduct.urunKodu} 
                    disabled 
                    style={{ marginBottom: 10 }}
                  />
                </div>
                <div>
                  <label>Ürün Adı</label>
                  <Input 
                    value={currentProduct.urunAdi} 
                    onChange={(e) => handleInputChange(e, 'urunAdi')} 
                    style={{ marginBottom: 10 }}
                  />
                </div>
                <div>
                  <label>Üretici Kodu</label>
                  <Input 
                    value={currentProduct.ureticiKodu} 
                    onChange={(e) => handleInputChange(e, 'ureticiKodu')} 
                    style={{ marginBottom: 10 }}
                  />
                </div>
                <div>
                  <label>Barkod Kodu</label>
                  <Input 
                    value={currentProduct.barkodKodu} 
                    onChange={(e) => handleInputChange(e, 'barkodKodu')} 
                    style={{ marginBottom: 10 }}
                  />
                </div>
                <div>
                  <label>Birim</label>
                  <Input 
                    type="number"
                    value={currentProduct.birim} 
                    onChange={(e) => handleInputChange(e, 'birim')} 
                    style={{ marginBottom: 10 }}
                  />
                </div>
                <div>
                  <label>Üretici</label>
                  <Input 
                    value={currentProduct.uretici} 
                    onChange={(e) => handleInputChange(e, 'uretici')} 
                    style={{ marginBottom: 10 }}
                  />
                </div>
                <div>
                  <label>Ürün Tip</label>
                  <Input 
                    value={currentProduct.urunTip} 
                    onChange={(e) => handleInputChange(e, 'urunTip')} 
                    style={{ marginBottom: 10 }}
                  />
                </div>
                <div>
                  <label>Marka</label>
                  <Input 
                    value={currentProduct.marka} 
                    onChange={(e) => handleInputChange(e, 'marka')} 
                    style={{ marginBottom: 10 }}
                  />
                </div>
                <div>
                  <label>Model</label>
                  <Input 
                    value={currentProduct.model} 
                    onChange={(e) => handleInputChange(e, 'model')} 
                    style={{ marginBottom: 10 }}
                  />
                </div>
                <div>
                  <label>Alış Fiyatı (₺)</label>
                  <Input 
                    type="number"
                    value={currentProduct.alisFiyati} 
                    onChange={(e) => handleInputChange(e, 'alisFiyati')} 
                    style={{ marginBottom: 10 }}
                  />
                </div>
                <div>
                  <label>Satış Fiyatı (₺)</label>
                  <Input 
                    type="number"
                    value={currentProduct.satisFiyati} 
                    onChange={(e) => handleInputChange(e, 'satisFiyati')} 
                    style={{ marginBottom: 10 }}
                  />
                </div>
              </>
            )}
          </Modal>
          <Modal
              title="Silme Onayı"
              open={isDeleteModalVisible}
              onOk={confirmDelete}
               onCancel={() => setIsDeleteModalVisible(false)}
                okText="Evet"
                cancelText="İptal"
            > 
                Seçili ürünü silmek istediğinize emin misiniz?
            </Modal>


          
        </>
      ) : (
        <div style={{ padding: '20px', textAlign: 'center', color: 'gray' }}>
          Ürün bulunamadı.
        </div>
      )}
    </div>
  );
};

export default StokList;
