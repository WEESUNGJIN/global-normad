import Input from "@/components/Input";

interface Props {
  nickname: string;
  email: string;
  setNickname: (value: string) => void;
  error: string;
}

export default function NicknameInput({
  nickname,
  email,
  setNickname,
  error,
}: Props) {
  return (
    <>
      <Input
        label="닉네임"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        placeholder={nickname || "닉네임을 입력하세요"}
        status={error.includes("닉네임") ? "error" : "default"}
        helpText={error.includes("닉네임") ? error : ""}
      />
      <Input label="이메일" value={email} disabled placeholder={email} />
    </>
  );
}
