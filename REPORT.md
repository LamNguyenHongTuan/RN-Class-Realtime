# 📄 BÁO CÁO KỸ THUẬT MINI-PROJECT 2
## ỨNG DỤNG ĐẶT PHÒNG HỌC & LAB THỜI GIAN THỰC VKU STUDYSPOT (REACT NATIVE & EXPO SDK)

**Trường:** Đại học Công nghệ Thông tin & Truyền thông Việt - Hàn (VKU)  
**Học phần:** Lập trình ứng dụng di động (Mobile App Development)  
**Họ và tên sinh viên:** Nguyễn Văn A  
**Mã sinh viên (MSSV):** 21IT001  
**Lớp / Chuyên ngành:** 21IT - Khoa Khoa học Máy tính  
**Bộ sản phẩm nộp bài:** Live Demo PWA, Mã nguồn GitHub & Báo cáo kỹ thuật (2–4 trang)  

---

## 1. Tổng quan đề tài & Bài toán thực tế
Tại khuôn viên trường VKU, sinh viên, các nhóm đồ án tốt nghiệp và đội tuyển nghiên cứu AI / ICPC có nhu cầu cao về việc sử dụng các phòng tự học, phòng hội thảo và phòng máy tính cấu hình cao tại các tòa nhà:
- **Tòa nhà A:** Khu giảng đường & phòng hội thảo học thuật.
- **Tòa nhà B:** Khu thực hành phần mềm & hệ thống CNTT.
- **Tòa nhà C:** Khu học liệu & thư viện đa phương tiện.
- **Tòa nhà V:** Trung tâm Đổi mới sáng tạo & Vườn ươm công nghệ Việt - Hàn.

Ứng dụng **VKU StudySpot** được xây dựng nhằm giải quyết triệt để vấn đề xung đột lịch đặt phòng, loại bỏ việc sinh viên phải đi gõ cửa từng phòng để kiểm tra thực tế, cung cấp mã vé vào phòng QR kỹ thuật số và nhắc nhở sinh viên trước 15 phút.

---

## 2. Bảng kiểm tra tính năng bắt buộc (Feature Checklist)

| STT | Yêu cầu nghiệp vụ | Công nghệ & Chi tiết thực hiện | Trạng thái |
|---|---|---|:---:|
| **1.1** | **Khám phá phòng (FlatList)** | Sử dụng `<FlatList />` nguyên bản của `react-native`, cấu hình ảo hóa với `initialNumToRender={4}`, `windowSize={5}` duy trì cuộn mượt 60fps. | **HOÀN THÀNH** |
| **1.2** | **Trạng thái thời gian thực** | Tự động tính toán theo giờ hiện tại của hệ thống: hiển thị `Available Now` (xanh lá) hoặc `In Use Now` (vàng hổ phách). | **HOÀN THÀNH** |
| **1.3** | **Tìm kiếm tức thì** | `TextInput` tìm kiếm debounced theo tên phòng, mã phòng (vd: *Lab V-401*) và mô tả trang thiết bị. | **HOÀN THÀNH** |
| **1.4** | **Lọc theo tòa nhà** | Lọc tức thì theo các tòa nhà **A**, **B**, **C**, và **V**. | **HOÀN THÀNH** |
| **1.5** | **Lọc theo sức chứa** | Lựa chọn sức chứa từ 2 đến 20 sinh viên. | **HOÀN THÀNH** |
| **1.6** | **Lọc trang thiết bị** | Multi-select chips cho Máy chiếu, Bảng trắng, PC cấu hình cao, Điều hòa, Smart TV, Mạng LAN. | **HOÀN THÀNH** |
| **2.1** | **Lịch cuốn chiếu 7 ngày** | Thanh cuộn chọn ngày ngang gồm Hôm nay và 6 ngày tới. | **HOÀN THÀNH** |
| **2.2** | **Khung giờ cố định 2 tiếng** | `07:30–09:30`, `09:30–11:30`, `13:00–15:00`, `15:00–17:00`, `17:30–19:30`. | **HOÀN THÀNH** |
| **2.3** | **Conflict Engine** | Khung giờ đã có người đặt sẽ bị khóa (disabled) kèm nhãn `Occupied` và hiển thị tên người đặt, ngăn chặn 100% đặt trùng. | **HOÀN THÀNH** |
| **2.4** | **Vé vào phòng QR SVG** | Sinh mã vé ngẫu nhiên (vd: `VKU-V401-7821`) và tạo mã QR bằng thư viện `react-native-qrcode-svg`. | **HOÀN THÀNH** |
| **2.5** | **Giả lập check-in cửa** | Màn hình Scanner và nút "Simulate Door QR Check-in" đổi trạng thái sang `Checked In`. | **HOÀN THÀNH** |
| **3.1** | **Quản lý State toàn cục** | `useBookingStore` viết bằng Zustand quản lý phiên sinh viên, danh sách đặt phòng và bộ lọc. | **HOÀN THÀNH** |
| **3.2** | **Lưu trữ dữ liệu cục bộ** | Tích hợp `@react-native-async-storage/async-storage` qua Zustand `persist` middleware. | **HOÀN THÀNH** |
| **4.1** | **Nhắc lịch trước 15 phút** | Tích hợp `expo-notifications` lên lịch tự động trước 15 phút khi khung giờ bắt đầu. | **HOÀN THÀNH** |

---

## 3. Kiến trúc kỹ thuật & Tối ưu hóa hiệu năng

### 3.1 Cấu trúc Component & Luồng dữ liệu
```
App.tsx (NavigationContainer & SafeAreaProvider)
├── RootNavigator (@react-navigation/bottom-tabs)
│   ├── Tab 1: ExploreScreen (Tìm kiếm & FlatList phòng)
│   │   ├── FilterBar (Chips Tòa nhà, Sức chứa & Thiết bị)
│   │   └── RoomCard (Component memoized)
│   ├── Tab 2: MyBookingsScreen (Danh sách vé đặt & lịch sử)
│   ├── Tab 3: QRScannerScreen (Khung ngắm quét mã QR mở cửa)
│   ├── Tab 4: ProfileScreen (Thẻ SV số & Cài đặt thông báo)
│   └── Tab 5: ReportScreen (Màn hình báo cáo kỹ thuật 2-4 trang)
├── Modals:
│   ├── BookingModal (Chọn lịch 7 ngày & Conflict Engine)
│   └── QRCodeModal (Hiển thị mã QR vào phòng & Giả lập)
└── NotificationBanner (Toast thông báo đẩy trong app)
```

### 3.2 Tối ưu hóa 60fps Scrolling trên FlatList
Để đảm bảo danh sách phòng cuộn đạt 60 khung hình/giây trên cả các thiết bị cấu hình thấp:
1. **Memoization với `React.memo`**: `RoomCard` được bọc bởi `React.memo` với hàm so sánh tùy chỉnh kiểm tra các trường `id`, `isOccupiedNow`, `capacity`, và `name`. Khi bộ lọc hoặc các phòng khác thay đổi, các card không bị ảnh hưởng sẽ không bị render lại.
2. **Memoize Event Callbacks với `useCallback`**: Hàm xử lý `handleBook` được memoize bằng `useCallback`, tránh tạo lại hàm mới ở mỗi chu kỳ render của cha.
3. **Các thông số FlatList**:
   - `initialNumToRender={4}`: Chỉ render 4 phần tử đầu tiên lúc khởi động để giảm thời gian TTI.
   - `maxToRenderPerBatch={4}`: Giới hạn số lượng phần tử render trong mỗi đợt cuộn.
   - `windowSize={5}`: Giảm diện tích cửa sổ ảo hóa trong bộ nhớ.
   - `removeClippedSubviews={true}`: Giải phóng tài nguyên các view nằm ngoài vùng nhìn thấy của màn hình.

---

## 4. Đặc tả giải thuật Conflict Engine (Chống trùng lịch)

Thuật toán kiểm tra xung đột thời gian thực:

```typescript
function checkSlotConflict(
  bookings: Booking[],
  roomId: string,
  date: string,
  slotId: string
): { isConflict: boolean; conflictingBooking?: Booking } {
  const match = bookings.find(
    (b) =>
      b.roomId === roomId &&
      b.date === date &&
      b.slotId === slotId &&
      (b.status === 'active' || b.status === 'checked_in')
  );

  return {
    isConflict: Boolean(match),
    conflictingBooking: match,
  };
}
```

- Khi sinh viên chọn một ngày bất kỳ, toàn bộ 5 khung giờ trong ngày đó của phòng được đối soát với danh sách `bookings` đã lưu trong `AsyncStorage`.
- Nếu phát hiện trùng, nút chọn khung giờ sẽ bị vô hiệu hóa (`disabled`), đổi sang màu đỏ nhạt kèm nhãn `Occupied` và hiển thị tên sinh viên đã đặt trước.
- Khi người dùng gửi form đặt phòng, hệ thống tiến hành kiểm tra lại một lần nữa trước khi ghi nhận vào store, loại bỏ hoàn toàn khả năng xảy ra race condition.

---

## 5. Kết luận & Thông tin bàn giao
- **Live Demo PWA:** Xuất sẵn thư mục `dist/` thông qua `npm run build:web`, sẵn sàng triển khai trên Cloudflare Pages hoặc Vercel.
- **Mã nguồn:** Đầy đủ, sạch sẽ, tuân thủ TypeScript nghiêm ngặt và kiến trúc phân tầng chuẩn React Native & Expo SDK.
- **Báo cáo:** Được tích hợp trực tiếp trong ứng dụng và có thể xuất ra file PDF 2–4 trang tiêu chuẩn.
