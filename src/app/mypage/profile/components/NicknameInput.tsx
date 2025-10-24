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
  const MAX_LENGTH = 10;
  const nicknameLimit = nickname.trim().length >= MAX_LENGTH;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value.trim().length <= MAX_LENGTH) {
      setNickname(value);
    }
  };
  return (
    <>
      <Input
        label="닉네임"
        value={nickname}
        onChange={handleChange}
        placeholder={nickname || "닉네임을 입력하세요"}
        status={error.includes("닉네임") || nicknameLimit ? "error" : "default"}
        helpText={
          nicknameLimit
            ? "닉네임은 10자 이하로 입력해주세요."
            : error.includes("닉네임")
              ? error
              : ""
        }
      />
      <div className="[&_input:disabled]:text-gray-400 [&_input:disabled]:bg-gray-50 [&_input:disabled]:cursor-not-allowed">
        <Input
          label="이메일"
          value={email}
          disabled
          placeholder={email}
          className="text-gray-400"
        />
      </div>
    </>
  );
}
