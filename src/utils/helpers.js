export const getTierColor = (tier) => {
  switch(tier) {
    case 'Platinum': return 'text-[#c7a96a]';
    case 'Gold': return 'text-yellow-600';
    case 'Silver': return 'text-gray-500';
    default: return 'text-blue-600';
  }
};

export const getbuttoncolour = (compareresult) => {
  switch(compareresult){
    case false : return 'bg-blue-500 text-white px-6 py-4 rounded hover:bg-blue-600';
    case true : return 'bg-gray-300 text-gray px-6 py-4 rounded hover:bg-gray-600';
  }
}

export const discount = (tier) => {
  switch(tier) {
    case 'Platinum': return 0.1;
    case 'Gold': return 0.05;
    default: return 0;
  }
}