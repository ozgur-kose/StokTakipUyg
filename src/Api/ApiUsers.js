const BASE_URL = "https://v1.nocodeapi.com/ozgurkose/google_sheets/zdoAbrmemcqqgcOI?tabId=users";

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

// Nocode API servisleri
const nocodeApiService = {
  getAll: () => request(BASE_URL),

  add: (row) => request(BASE_URL, "POST", [row]),

  update: (rowIndex, updatedRow) => {
    const updatedWithRowId = {
      ...updatedRow,
      row_id: rowIndex.toString(),
    };
    return request(`${BASE_URL}&row_id=${rowIndex}`, "PUT", updatedWithRowId);
  },

  delete: (rowIndex) => request(`${BASE_URL}&row_id=${rowIndex}`, "DELETE"),

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

// ApiUsers tanımı (en son)
const ApiUsers = {
  ...nocodeApiService,

  authenticate: async (username, password) => {
    try {
      const allData = await nocodeApiService.getAll();
      const rows = allData.data;
  
      console.log("rows[0] =>", rows[0]);
  
      // Başlık kontrolüne gerek yok, doğrudan objeyle çalışıyoruz
      const userRow = rows.find(
        (row) =>
          row.kullaniciAdi?.toLowerCase() === username.toLowerCase() &&
          row.sifre === password
      );
  
      return !!userRow;
    } catch (error) {
      console.error("Authenticate hatası:", error);
      throw error;
    }
  },
};

export default ApiUsers;
