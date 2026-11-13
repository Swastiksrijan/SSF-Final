import ImsLayout from '../ImsLayout';
import { Card, PageHeader } from '../ui';
import { useLang } from '../LangContext';
import DownloadCenter from '../DownloadCenter';

/** Records > Download Centre — pick any register + format (CSV / Excel / PDF). */
export default function ImsDownloadCenter() {
  const { t } = useLang();
  return (
    <ImsLayout active="download_center">
      <PageHeader title={t('download_center')} subtitle={t('tagline')} />
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-semibold text-slate-700">{t('what_download')}</p>
          <p className="mt-1 text-sm text-slate-500">{t('select_register_hint')}</p>
        </div>
        <DownloadCenter variant="hero" />
      </Card>
    </ImsLayout>
  );
}
