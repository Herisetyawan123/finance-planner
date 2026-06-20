const STORAGE_PREFIX = 'planner';

export const getPlannerStorageKeys = (month, year) => ({
  draftKey: `${STORAGE_PREFIX}-draft-${month}-${year}`,
  backendKey: `${STORAGE_PREFIX}-backend-${month}-${year}`,
});

export const loadPlannerStorage = (month, year) => {
  const { draftKey, backendKey } = getPlannerStorageKeys(month, year);
  return {
    draft: window.localStorage.getItem(draftKey),
    backend: window.localStorage.getItem(backendKey),
  };
};

export const savePlannerStorage = (month, year, snapshot, options = { draft: true, backend: true }) => {
  const { draftKey, backendKey } = getPlannerStorageKeys(month, year);
  if (options.draft) {
    window.localStorage.setItem(draftKey, snapshot);
  }

  if (options.backend) {
    window.localStorage.setItem(backendKey, snapshot);
  }
};

export const removePlannerStorage = (month, year, options = { draft: true, backend: false }) => {
  const { draftKey, backendKey } = getPlannerStorageKeys(month, year);
  if (options.draft) {
    window.localStorage.removeItem(draftKey);
  }

  if (options.backend) {
    window.localStorage.removeItem(backendKey);
  }
};
