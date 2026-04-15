import { useTranslations } from "next-intl";

export function useTranslation(namespace?: Parameters<typeof useTranslations>[0]) {
  const t = useTranslations(namespace as never);
  return { t };
}

