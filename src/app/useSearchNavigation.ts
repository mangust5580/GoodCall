import { useNavigate } from 'react-router-dom';

import { searchPath } from './routes';

export function useSearchNavigation(): (value: string) => void {
  const navigate = useNavigate();

  return (value: string) => {
    const query = value.trim();

    if (query !== '') {
      void navigate(searchPath(query));
    }
  };
}
