"use client";

import { useState } from "react";
import Script from "next/script";
import Input from "@/components/Input";

interface DaumPostcodeData {
  address: string;
  addressType: "R" | "J"; // R: 도로명, J: 지번
  bname: string; // 법정동명
  buildingName: string; // 건물명
  zonecode: string; // 우편번호
  jibunAddress: string; // 지번주소
  roadAddress: string; // 도로명주소
  userSelectedType: "R" | "J"; // 사용자가 선택한 주소 타입
}

export default function AddressInput() {
  const [address, setAddress] = useState("");

  const openDaumPostcode = () => {
    // 우편번호 검색 위젯을 생성하는 생성자
    new window.daum.Postcode({
      // 사용자가 주소를 선택했을 때 실행되는 콜백함수
      oncomplete: function (data: DaumPostcodeData) {
        let fullAddr = data.address; // 주소 변수
        let extraAddr = ""; // 참고항목 변수

        // 사용자가 선택한 주소 타입에 따라 해당 주소 값을 가져옴.
        if (data.addressType === "R") {
          if (data.bname !== "") extraAddr += data.bname;
          if (data.buildingName !== "")
            extraAddr +=
              extraAddr !== "" ? `, ${data.buildingName}` : data.buildingName;
          fullAddr += extraAddr !== "" ? ` (${extraAddr})` : "";
        }
        // 최종 주소 저장
        setAddress(fullAddr);
      },
    }).open();
  };

  return (
    <>
      {/* 다음 우편번호 API 불러오기 */}
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
      />

      {/* 기본 주소 */}
      <div className="flex gap-2 mb-3">
        <Input
          placeholder="주소를 입력해 주세요"
          value={address}
          readOnly
          onClick={openDaumPostcode}
        />
      </div>
    </>
  );
}
