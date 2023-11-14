import LoginButton from '@/components/LoginButton';

export default function LoginPage({ searchParams }: { searchParams: any }) {
  const { code } = searchParams;

  return (
    <>
      <h1 className="pt-36 text-center text-4xl font-bold leading-tight text-white">
        Login to Repohistory
      </h1>
      <div className="flex flex-col items-center gap-10">
        <LoginButton code={code} />
      </div>
    </>
  );
}
