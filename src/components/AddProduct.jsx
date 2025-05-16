import React from 'react';
import { Form, Input, InputNumber, Select, Button, message } from 'antd';
import styles from './AddProduct.module.css';
import Api from '../Api/Api.js';
import { useContext } from 'react'; 
import { StockContext } from '../components/StockContext.jsx'; // StokContext'i import et


const { Option } = Select;

const AddProduct = () => {
  const { incrementEntry } = useContext(StockContext); // StokContext'ten gerekli değerleri al
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values) => {
    try {
      // Sheets'deki kolon sırasına göre dizilim yap 
      const newRow = [
        values.productCode,
        values.productName,
        values.manufacturerCode,
        values.barcode,
        values.manufacturer,
        values.productType,
        values.brand,
        values.model,
        values.unit,
        values.purchasePrice,
        values.salePrice
      ];

      await Api.add(newRow);
      incrementEntry(); // StokContext'teki sayacı artır
      messageApi.open({
        type: 'success', 
        content: 'Ürün başarıyla eklendi.',
      });
      form.resetFields(); // formu temizle
    } catch (error) {
      console.error("Ürün eklenirken hata oluştu:", error);
      messageApi.open({
        type: 'error',
        content: 'Ürün eklenemedi!',
      });
    }
  };

  return (
    <div className={styles.container}>
      {contextHolder}
      <div className={styles.formTitle}>Yeni Ürün Ekle</div>
      <Form
        form={form}
        name="add-product"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item name="productCode" label="Ürün Kodu" rules={[{ required: true, message: 'Lütfen ürün kodunu giriniz' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="productName" label="Ürün Adı" rules={[{ required: true, message: 'Lütfen ürün adını giriniz' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="manufacturerCode" label="Üretici Kodu" rules={[{ required: true, message: 'Lütfen üretici kodunu giriniz' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="barcode" label="Barkod Kodu" rules={[{ required: true, message: 'Lütfen barkod kodunu giriniz' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="manufacturer" label="Üretici" rules={[{ required: true, message: 'Lütfen üretici adını giriniz' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="productType" label="Ürün Tipi" rules={[{ required: true, message: 'Lütfen ürün tipi seçiniz' }]}>
          <Select placeholder="Ürün tipi seçiniz">
            <Option value="elektronik">Elektronik</Option>
            <Option value="kırtasiye">Kırtasiye</Option>
            <Option value="gıda">Gıda</Option>
          </Select>
        </Form.Item>

        <Form.Item name="brand" label="Marka" rules={[{ required: true, message: 'Lütfen marka adını giriniz' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="model" label="Model" rules={[{ required: true, message: 'Lütfen model bilgisini giriniz' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="unit" label="Birim" rules={[{ required: true, message: 'Lütfen birim giriniz (adet, kg vb.)' }]}>
          <Input />
        </Form.Item>

        <Form.Item name="purchasePrice" label="Alış Fiyatı" rules={[{ required: true, message: 'Lütfen alış fiyatı giriniz' }]}>
          <InputNumber min={0} style={{ width: '100%' }} addonAfter="₺" />
        </Form.Item>

        <Form.Item name="salePrice" label="Satış Fiyatı" rules={[{ required: true, message: 'Lütfen satış fiyatı giriniz' }]}>
          <InputNumber min={0} style={{ width: '100%' }} addonAfter="₺" />
        </Form.Item>

        <Form.Item className={styles.buttonWrapper}>
          <Button type="primary" htmlType="submit" block>
            Ürünü Kaydet
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddProduct;
