export const getTierColor = (tier) => {
  switch(tier) {
    case 'Platinum': return 'text-purple-600';
    case 'Gold': return 'text-yellow-600';
    case 'Silver': return 'text-gray-500';
    default: return 'text-blue-600';
  }
};
