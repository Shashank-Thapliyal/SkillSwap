import React from 'react';
import { useParams } from 'react-router-dom';
import ProposalTabNavigation from './ProposalTabNavigation';
import ReceivedProposals from './ReceivedProposals';
import SentProposals from './SentProposals';

const ProposalsWrapper = () => {
  const { tab = 'received' } = useParams();

  const renderTabContent = () => {
    switch (tab) {
      case 'sent':
        return <SentProposals />;
      case 'received':
      default:
        return <ReceivedProposals />;
    }
  };

  return (
    <div>
      <ProposalTabNavigation activeTab={tab} />
      {renderTabContent()}
    </div>
  );
};

export default ProposalsWrapper;