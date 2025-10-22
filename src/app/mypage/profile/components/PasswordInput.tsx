import Input from "@/components/Input";

interface Props {
  password: string;
  checkPassword: string;
  setPassword: (v: string) => void;
  setCheckPassword: (v: string) => void;
  error: string;
}

export default function PasswordInput({
  password,
  checkPassword,
  setPassword,
  setCheckPassword,
  error,
}: Props) {
  return (
    <>
      <Input
        label="새 비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        showPasswordToggle
        placeholder="8자 이상 입력해주세요."
        status={error.includes("비밀번호") ? "error" : "default"}
        helpText={
          error.includes("비밀번호")
            ? "영문과 숫자를 포함해서 8자 이상 입력해주세요."
            : ""
        }
      />
      <Input
        label="비밀번호 확인"
        value={checkPassword}
        onChange={(e) => setCheckPassword(e.target.value)}
        showPasswordToggle
        placeholder="비밀번호를 한 번 더 입력해주세요."
        status={
          password && checkPassword && password !== checkPassword
            ? "error"
            : "default"
        }
        helpText={
          password && checkPassword && password !== checkPassword
            ? "비밀번호가 일치하지 않습니다"
            : ""
        }
      />
    </>
  );
}
