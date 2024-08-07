import { redirect } from 'react-router-dom';
import { useStore } from '~/store';

export { addPropertyAction } from './protected/properties/add-property';
export { propertyLoader, updatePropertyAction } from './protected/properties/edit-property';
export { propertiesLoader } from './protected/properties/properties';
export { createReportAction } from './protected/reports/create-report';
export { reportLoader,updateReportAction } from './protected/reports/edit-report';
export { reportDetailsLoader } from './protected/reports/report-details';
export { messageDetailsLoader } from './protected/reports/message-details';
export { pageDetailsLoader } from './protected/reports/page-details';
export { tagDetailsLoader } from './protected/reports/tag-details';
export { reportsLoader } from './protected/reports/reports';
export { scansLoader } from './protected/scans';

export const authenticatedLoader = (loader: any) => async (args: any) => {
    const { isAuthenticated } = useStore.getState();
  
    if (!isAuthenticated) {
      throw redirect('/login');
    }
  
    return loader(args);
  };
