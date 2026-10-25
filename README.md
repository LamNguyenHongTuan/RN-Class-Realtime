# 🎓 VKU StudySpot — Real-Time Campus Study Room Booking App (React Native & Expo SDK)

[![VKU Brand](https://img.shields.io/badge/University-VKU%20Danang-red?style=for-the-badge)](https://vku.udn.vn)
[![React Native](https://img.shields.io/badge/React%20Native-0.88-blue?style=for-the-badge&logo=react)](https://reactnative.dev)
[![Expo SDK](https://img.shields.io/badge/Expo-SDK%20Ready-black?style=for-the-badge&logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![React Navigation](https://img.shields.io/badge/Navigation-React%20Navigation-6b21a8?style=for-the-badge)](https://reactnavigation.org)
[![Zustand](https://img.shields.io/badge/State-Zustand%20AsyncStorage-purple?style=for-the-badge)](https://github.com/pmndrs/zustand)
[![PWA Ready](https://img.shields.io/badge/PWA-Web%20Export%20Ready-emerald?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)

> **Mini-Project 2 Submission Package**  
> **Course:** Mobile Application Development (React Native & Expo)  
> **Target Scenario:** Vietnam - Korea University of Information and Communication Technology (VKU) Campus

---

## 📋 Mục lục / Table of Contents
1. [Giới thiệu & Bài toán thực tế (VKU Campus)](#-giới-thiệu--bài-toán-thực-tế)
2. [Gói nộp bài bắt buộc (3 Deliverables)](#-gói-nộp-bài-bắt-buộc-3-deliverables)
3. [Checklist tính năng theo yêu cầu đề bài](#-checklist-tính-năng-theo-yêu-cầu-đề-bài)
4. [Kiến trúc hệ thống & Tối ưu FlatList 60fps](#-kiến-trúc-hệ-thống--tối-ưu-flatlist-60fps)
5. [Hướng dẫn chạy ứng dụng (Expo Go & Web PWA)](#-hướng-dẫn-chạy-ứng-dụng)
6. [Hướng dẫn triển khai Live Demo (Cloudflare Pages / Vercel)](#-triển-khai-live-demo)
7. [Cấu trúc mã nguồn thư mục](#-cấu-trúc-mã-nguồn-thư-mục)
8. [Xuất báo cáo kỹ thuật (2–4 trang PDF)](#-xuất-báo-cáo-kỹ-thuật-pdf)

---

## 🎯 Giới thiệu & Bài toán thực tế
Sinh viên VKU, các nhóm làm đồ án tốt nghiệp và đội tuyển ICPC thường xuyên gặp phải tình trạng xung đột phòng, phòng đã có người đặt nhưng không có bảng hiển thị dẫn đến việc phải đi kiểm tra từng tầng tại các tòa nhà **A, B, C, V**.

**VKU StudySpot** được xây dựng chuẩn **100% React Native & Expo SDK**, hỗ trợ chạy song song trên cả **điện thoại di động (qua Expo Go)** và **trình duyệt Web/PWA** (thông qua `react-native-web`).

Ứng dụng sở hữu feed danh sách phòng ảo hóa 60fps mượt mà, bộ lọc thông minh đa thông số, engine chống trùng lịch thời gian thực (conflict engine), mã vé vào phòng QR kỹ thuật số kèm cơ chế nhắc lịch trước 15 phút qua `expo-notifications`.

---

## 📦 Gói nộp bài bắt buộc (3 Deliverables)

| # | Hạng mục nộp bài | Chi tiết & Trạng thái |
|---|---|---|
| **1** | **Live Demo URL** | Bản xuất web tĩnh chuẩn PWA nằm sẵn trong thư mục `dist/` (được tạo bởi `npx expo export -p web`), sẵn sàng kéo thả lên **Cloudflare Pages** hoặc **Vercel** lấy link trực tiếp. |
| **2** | **GitHub Repository** | Mã nguồn chuẩn Expo SDK, phân chia modules rõ ràng (`components`, `screens`, `store`, `navigation`, `utils`), commit lịch sử chuẩn mực và README hướng dẫn đầy đủ. |
| **3** | **Báo cáo tóm tắt (2–4 trang PDF)** | Được biên soạn chi tiết tại [`REPORT.md`](file:///C:/Users/chipz/.gemini/antigravity/scratch/vku-study-booking/REPORT.md) và tích hợp tab **"Report PDF"** ngay trong app kèm nút **"Save as PDF"**. |

---

## ✅ Checklist tính năng theo yêu cầu đề bài

### 1. Khám phá phòng & Bộ lọc đa thông số (Room Discovery & Multi-Parameter Filter)
- [x] **FlatList 60fps Scrolling:** Sử dụng component `<FlatList />` nguyên bản từ `react-native` kết hợp `React.memo` tại `RoomCard` và các tham số ảo hóa (`initialNumToRender={4}`, `windowSize={5}`).
- [x] **Trạng thái thời gian thực:** Badge `Available Now` (xanh lá) và `In Use Now` (vàng hổ phách) tự động tính toán theo đồng hồ hệ thống.
- [x] **Tìm kiếm tức thì:** Tìm kiếm theo tên phòng (vd: *Lab V-401*, *B-305*), mã phòng và mô tả trang thiết bị.
- [x] **Filter Chips theo tòa nhà:** Lọc tức thì theo các tòa nhà VKU: **A** (Khu giảng đường), **B** (Lab CNTT), **C** (Thư viện), **V** (Trung tâm Đổi mới sáng tạo Việt - Hàn).
- [x] **Lọc sức chứa (Capacity):** Thanh chọn sức chứa linh hoạt từ 2 đến 20 sinh viên.
- [x] **Lọc trang thiết bị (Equipment Chips):** Chọn nhiều thiết bị đồng thời: *Projector*, *Whiteboard*, *High-spec PC*, *Air Conditioner*, *Smart TV*, *High-Speed LAN*.

### 2. Chọn khung giờ 2 tiếng & Conflict Engine (Time-Slot Selector & Conflict Engine)
- [x] **Lịch 7 ngày cuốn chiếu:** Thanh chọn ngày ngang (Hôm nay và 6 ngày kế tiếp).
- [x] **Khung giờ cố định 2 tiếng:**
  - `07:30 – 09:30` (Ca sáng 1)
  - `09:30 – 11:30` (Ca sáng 2)
  - `13:00 – 15:00` (Ca chiều 1)
  - `15:00 – 17:00` (Ca chiều 2)
  - `17:30 – 19:30` (Ca tối tự học)
- [x] **Trực quan hóa chống trùng lịch (Conflict Prevention):** Những khung giờ đã có người đặt sẽ tự động bị khóa (disabled) kèm nhãn `Occupied` và hiển thị tên người đặt trước, ngăn chặn 100% tình trạng đặt trùng phòng.
- [x] **Tạo vé vào phòng QR kỹ thuật số:** Tự động sinh mã vé ngẫu nhiên (vd: `VKU-V401-7821`) và hiển thị Modal mã QR vector SVG (`react-native-qrcode-svg`).

### 3. Quản lý trạng thái toàn cục với Zustand & AsyncStorage
- [x] **Dedicated `useBookingStore`:** Quản lý phiên sinh viên VKU (MSSV: `21IT001`), danh sách đặt phòng, bộ lọc tìm kiếm và các tác vụ hủy phòng.
- [x] **Lưu trữ cục bộ:** Sử dụng Zustand `persist` middleware kết hợp `@react-native-async-storage/async-storage`.

### 4. Thông báo cục bộ & Trình giả lập quét mã cửa
- [x] **Nhắc nhở trước 15 phút:** Tích hợp `expo-notifications` lên lịch thông báo tự động trước 15 phút khi khung giờ bắt đầu.
- [x] **Nút kiểm tra thông báo tức thì:** Cho phép thầy cô / người chấm click **"Test 15-Minute Alert Now"** để kiểm tra ngay mà không cần đợi.
- [x] **Mô phỏng máy quét cửa:** Màn hình Scanner với khung ngắm reticle camera mô phỏng việc sinh viên quét mã mở khóa cửa phòng.

---

## 🏗️ Kiến trúc hệ thống & Tối ưu FlatList 60fps

```
┌────────────────────────────────────────────────────────┐
│             VKU StudySpot (React Native App)           │
├────────────────────────────────────────────────────────┤
│ Navigation: @react-navigation/bottom-tabs              │
│ ├── Tab 1: ExploreScreen (FlatList Feed & FilterBar)   │
│ ├── Tab 2: MyBookingsScreen (Vé QR & Lịch sử đặt)      │
│ ├── Tab 3: QRScannerScreen (Giả lập quét mã cửa)       │
│ ├── Tab 4: ProfileScreen (Thẻ SV số & Cài đặt)         │
│ └── Tab 5: ReportScreen (Báo cáo kỹ thuật 2-4 trang)   │
├────────────────────────────────────────────────────────┤
│ State: useBookingStore (Zustand + AsyncStorage)        │
│ Engine: Conflict Engine (checkSlotConflict)            │
│ Notifications: expo-notifications                      │
└────────────────────────────────────────────────────────┘
```

### Kỹ thuật tối ưu FlatList 60fps:
```tsx
export const RoomCard = React.memo(
  ({ room, onBook, isOccupiedNow }) => { ... },
  (prev, next) =>
    prev.room.id === next.room.id &&
    prev.isOccupiedNow === next.isOccupiedNow &&
    prev.room.capacity === next.room.capacity &&
    prev.room.name === next.room.name
);
```

---

## 💻 Hướng dẫn chạy ứng dụng

### Yêu cầu tiên quyết
- Node.js (v18+)
- Ứng dụng **Expo Go** trên điện thoại (tải miễn phí từ Google Play hoặc App Store)

### 1. Chạy trên điện thoại di động (Expo Go)
```bash
# 1. Di chuyển vào thư mục dự án
cd "C:\Users\chipz\.gemini\antigravity\scratch\vku-study-booking"

# 2. Khởi động Expo Metro Bundler
npx expo start
```
- Mở camera hoặc app **Expo Go** quét mã QR hiển thị trên màn hình terminal để chạy app trên điện thoại thật!

### 2. Chạy trên trình duyệt Web (Expo Web)
```bash
npx expo start --web
```
- Ứng dụng sẽ tự động mở tại `http://localhost:8081` trên trình duyệt web.

---

## 🌐 Triển khai Live Demo

Dự án đã được tích hợp sẵn lệnh đóng gói web tĩnh phục vụ nộp bài:
```bash
# Build xuất thư mục dist/
npm run build:web
```

### Triển khai lên Cloudflare Pages (Khuyên dùng - 1 phút)
1. Đăng nhập [pages.cloudflare.com](https://pages.cloudflare.com).
2. Chọn **Create application** -> **Pages** -> **Direct Upload**.
3. Kéo và thả thư mục `dist` của dự án lên và bấm **Deploy**.
4. Bạn sẽ có ngay link Live Demo (vd: `https://vku-study-spot.pages.dev`) hỗ trợ HTTPS và cài đặt PWA!

### Triển khai lên Vercel
```bash
npx vercel deploy --prod
```

---

## 📁 Cấu trúc mã nguồn thư mục

```
vku-study-booking/
├── App.tsx                     # Entry point (NavigationContainer & Modals)
├── app.json                    # Cấu hình Expo SDK & Web PWA settings
├── package.json                # Dependencies (React Native, Expo, Zustand, AsyncStorage)
├── src/
│   ├── components/
│   │   ├── BookingModal.tsx    # Modal chọn lịch 7 ngày & 2-hour conflict engine
│   │   ├── FilterBar.tsx       # Bộ lọc tòa nhà, sức chứa & trang thiết bị
│   │   ├── NotificationBanner.tsx # In-app push notification toast
│   │   ├── QRCodeModal.tsx     # Thẻ vé vào phòng QR SVG & nút giả lập check-in
│   │   └── RoomCard.tsx        # Card phòng memoized (React.memo 60fps)
│   ├── data/
│   │   ├── mockBookings.ts     # Dữ liệu mẫu lịch đặt phòng
│   │   └── mockRooms.ts        # Danh sách phòng lab các tòa A, B, C, V
│   ├── navigation/
│   │   └── RootNavigator.tsx   # React Navigation Bottom Tabs
│   ├── screens/
│   │   ├── ExploreScreen.tsx   # Danh sách phòng ảo hóa bằng native FlatList
│   │   ├── MyBookingsScreen.tsx# Vé phòng đang hoạt động & lịch sử
│   │   ├── ProfileScreen.tsx   # Thẻ sinh viên VKU số & thống kê
│   │   ├── QRScannerScreen.tsx # Giả lập cảm biến quét mã cửa
│   │   └── ReportScreen.tsx    # Báo cáo kỹ thuật 2-4 trang PDF
│   ├── store/
│   │   └── useBookingStore.ts  # Zustand Store + AsyncStorage persistence
│   ├── types/
│   │   └── index.ts            # Định nghĩa kiểu dữ liệu TypeScript
│   └── utils/
│       ├── conflicts.ts        # Thuật toán kiểm tra xung đột lịch
│       └── notifications.ts    # Tích hợp expo-notifications & scheduler
└── REPORT.md                   # Báo cáo kỹ thuật chi tiết mẫu nộp bài
```

---

## 📄 Xuất báo cáo kỹ thuật (PDF)

1. Khởi động app trên web (`npm run web`).
2. Nhấn vào tab **"Report PDF"** ở thanh điều hướng dưới cùng.
3. Bấm nút **"Save as PDF"** để in hoặc lưu file PDF 2–4 trang nộp cho giảng viên.
