const BASE_URL = "https://v1.nocodeapi.com/ozgurkose/google_sheets/zdoAbrmemcqqgcOI?tabId=Ürünler";

// Ortak fetch fonksiyonu
const request = async (url, method = "GET", data = null) => {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data && method !== "DELETE") {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "API hatası");
  }

  return await response.json();
};


const nocodeApiService = {
  // Tüm verileri getir
  getAll: () => request(BASE_URL),

  // Yeni satır ekle (dizi içinde olmalı)
  add: (row) => request(BASE_URL, "POST", [row]),

  // Satır güncelle (Google Sheets API'e göre row_id gerekir)
  // Satır güncelle (row_id hem URL'de hem de body'de olmalı)
  update: (rowIndex, updatedRow) => {
    const updatedWithRowId = {
      ...updatedRow,
      row_id: rowIndex.toString(), // Burası çok önemli
    };
    return request(`${BASE_URL}&row_id=${rowIndex}`, "PUT", updatedWithRowId);
  },
  

  
  

  // Satır sil
  delete: (rowIndex) =>
    request(`${BASE_URL}&row_id=${rowIndex}`, "DELETE"),
  

  // Anahtar kelime ile arama
  search: async (keyword) => {
    const allData = await request(BASE_URL);
    return allData.data.filter((row) =>
      row.some((cell) =>
        typeof cell === "string"
          ? cell.toLowerCase().includes(keyword.toLowerCase())
          : false
      )
    );
  },
};

export default nocodeApiService;
