import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { getUserSettings, getConnectedAccounts } from "@/actions/settings";
import { NotificationSettings } from "./notification-settings";
import { ConnectedAccounts } from "./connected-accounts";
import { ChangePasswordForm } from "./change-password-form";
import { ThemeSettings } from "./theme-settings";

export const metadata: Metadata = {
  title: "설정",
};

export default async function SettingsPage() {
  const [settings, accounts] = await Promise.all([
    getUserSettings(),
    getConnectedAccounts(),
  ]);

  return (
    <div>
      <PageHeader
        title="설정"
        description="계정 및 알림 설정을 관리하세요"
      />

      <div className="space-y-6">
        <ConnectedAccounts accounts={accounts} />
        <ChangePasswordForm />
        <NotificationSettings settings={settings} />
        <ThemeSettings theme={settings.theme} />
      </div>
    </div>
  );
}
