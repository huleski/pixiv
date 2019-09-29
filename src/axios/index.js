import fetch from './config.js'
//实时比分
export function HomeLiveScore(year, limit) {
  let uri = '/livescore';
  return fetch({
    url: uri,
    method: 'post',
    params:{'year': year},
    data: {
      'year': year,
      'limit': limit
    }
  });
}