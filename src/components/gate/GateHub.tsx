import {getTranslations} from 'next-intl/server';
import RevealScope from '@/components/motion/RevealScope';
import GateHubStage, {type GateHubLabels} from './GateHubStage';
import GatePillars from './GatePillars';
import type {GateBlock, GatePillar} from './types';

/**
 * The centre of the gate. Fetches the copy and hands it to the interactive
 * stage: the four functional wings and the association network flanking the
 * seal, with the five pillars beneath.
 */
export default async function GateHub() {
  const t = await getTranslations('gate');
  const blocks = t.raw('blocks') as GateBlock[];
  const pillars = t.raw('pillars') as GatePillar[];

  const labels: GateHubLabels = {
    blocksTitle: t('blocksTitle'),
    blocksLead: t('blocksLead'),
    blocksCta: t('blocksCta'),
    hubValue: t('hubValue'),
    hubTitle: t('hubTitle'),
    hubLead: t('hubLead'),
    hubCta: t('hubCta'),
    assocTitle: t('assocTitle'),
    assocValue: t('assocValue'),
    assocUnit: t('assocUnit'),
    assocLead: t('assocLead'),
    assocCta: t('assocCta'),
  };

  return (
    <>
      <RevealScope stagger={130}>
        <GateHubStage blocks={blocks} labels={labels} />
      </RevealScope>
      <RevealScope stagger={70} className="mt-4 sm:mt-5">
        <GatePillars pillars={pillars} />
      </RevealScope>
    </>
  );
}
