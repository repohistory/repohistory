import { Button, Link } from '@nextui-org/react';

export default function SettingsPage() {
  return (
    <div className="mx-auto w-4/5 sm:w-3/5 mt-20 flex flex-col items-start gap-5 pb-5">
      <h1 className="text-3xl font-bold text-white">Settings</h1>
      <Button
        href="https://github.com/apps/repohistory/installations/new"
        target="_blank"
        showAnchorIcon
        as={Link}
        radius="sm"
        className="bg-[#222222] text-white max-w-max w-full"
      >
        Configure selected repositories
      </Button>
    </div>
  );
}
