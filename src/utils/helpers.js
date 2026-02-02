export const getTierColor = (tier) => {
  switch(tier) {
    case 'Platinum': return 'text-purple-600';
    case 'Gold': return 'text-yellow-600';
    case 'Silver': return 'text-gray-500';
    default: return 'text-blue-600';
  }
};

export const getbuttoncolour = (compareresult) => {
  switch(compareresult){
    case false : return 'bg-yellow-300 text-white-700 px-6 py-4 rounded hover:bg-blue-600';
    case true : return 'bg-gray-300 text-gray-700 px-6 py-4 rounded hover:bg-gary-600';
  }
}