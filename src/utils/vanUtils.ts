
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': 
    case 'Actif': 
      return 'bg-green-100 text-green-800';
    case 'En Transit': 
      return 'bg-blue-100 text-blue-800';
    case 'Maintenance': 
      return 'bg-red-100 text-red-800';
    case 'Inactive': 
    case 'Inactif':
      return 'bg-gray-100 text-gray-800';
    default: 
      return 'bg-gray-100 text-gray-800';
  }
};
