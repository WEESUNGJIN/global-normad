"use client";

import Image from "next/image";
import Pagination from "@/components/Pagination";
import starIconOn from "@/assets/icon/icon_star_on.svg";
import starIconOff from "@/assets/icon/icon_star_off.svg";

const mockData = {
  averageRating: 4.2,
  totalCount: 1300,
  reviews: [
    {
      id: 1,
      user: {
        nickname: "김태현",
      },
      rating: 5,
      content:
        "저는 저희 스트릿 댄서 체험에 참가하게 된 지 얼마 안됐지만, 정말 즐거운 시간을 보냈습니다. 새로운 스타일과 춤추기를 좋아하는 나에게 정말 적합한 체험이었고, 전문가가 직접 강사로 참여하기 때문에 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있었습니다. 강사님께서 정말 친절하게 설명해주셔서 정말 좋았고, 이번 체험을 거쳐 새로운 스타일과 춤추기에 대한 열정이 더욱 생겼습니다. 저는 이 체험을 적극 추천합니다!",
      createdAt: "2023-02-04T00:00:00Z",
    },
    {
      id: 2,
      user: {
        nickname: "조민선",
      },
      rating: 5,
      content:
        "저는 저희 스트릿 댄서 체험에 참가하게 된 지 얼마 안됐지만, 정말 즐거운 시간을 보냈습니다. 전문가가 직접 강사로 참여하기 때문에 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있었고, 강사님의 친절한 설명 덕분에 저는 새로운 스타일과 춤추기에 대한 열정이 더욱 생겼습니다.",
      createdAt: "2023-02-04T00:00:00Z",
    },
    {
      id: 3,
      user: {
        nickname: "강지현",
      },
      rating: 5,
      content:
        "전문가가 직접 강사로 참여하기 때문에 어떤 수준의 춤추는 사람도 쉽게 이해할 수 있었습니다. 이번 체험을 거쳐 저의 춤추기 실력은 더욱 향상되었어요.",
      createdAt: "2023-02-04T00:00:00Z",
    },
  ],
};

export default function ExperienceDetailReviews() {
  const data = mockData;

  return (
    <section>
      <div className="pt-5 md:pt-8 lg:pt-10 flex gap-2 items-center">
        <h2 className="typo-16-b md:text-lg text-gray-950">체험 후기</h2>
        <p className="typo-14-sb md:text-base text-gray-700">1,300개</p>
      </div>

      <div className="pt-2 md:pt-3 md:pb-8 pb-7 text-center">
        <p className="typo-24-sb md:text-3xl mb-2 text-gray-950">
          {data.averageRating.toFixed(1)}
        </p>
        <p className="typo-14-b md:text-base text-gray-950 mb-2">매우 만족</p>
        <div className="flex justify-center items-center gap-1 typo-14-m text-gray-700">
          <Image src={starIconOn} alt="별 아이콘" width={16} height={16} />
          {data.totalCount.toLocaleString()}개의 후기
        </div>
      </div>

      {/* 후기 리스트 */}
      <div className="flex flex-col gap-10 lg:gap-5">
        {data.reviews.map((review) => (
          <div
            key={review.id}
            className="rounded-2xl bg-white shadow-searchbar p-5"
          >
            {/* 사용자 정보 */}
            <div className="flex items-center gap-2 mb-2 md:mb-3">
              <p className="typo-14-sb md:text-base text-gray-950">
                {review.user.nickname}
              </p>
              <span className="typo-12-sb md:text-sm text-gray-500">
                {review.createdAt.split("T")[0].replace(/-/g, ". ")}
              </span>
            </div>

            {/* 별점 */}
            <div className="flex gap-[1px] mb-2 md:mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Image
                  key={i}
                  src={i < review.rating ? starIconOn : starIconOff}
                  alt="별점 아이콘"
                  className="w-4 h-4"
                />
              ))}
            </div>

            {/* 후기 내용 */}
            <p className="typo-14-m md:text-base !leading-[1.7] text-gray-950">
              {review.content}
            </p>
          </div>
        ))}

        <Pagination
          page={1}
          totalPages={5}
          onChange={(p) => console.log("페이지 이동:", p)}
          className="mt-10"
        />
      </div>
    </section>
  );
}
