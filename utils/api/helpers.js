import pick from 'lodash/pick';

export const getMinifiedUser = (user) => pick(user, ['id_str', 'name', 'screen_name', 'profile_image_url_https']);

export const getMinifiedList = (list) => pick(list, ['id_str', 'name', 'description', 'mode', 'member_count']);

export const getRateLimitHeaders = (headers) => {
  const {
    'x-rate-limit-limit': limit,
    'x-rate-limit-remaining': remaining,
    'x-rate-limit-reset': reset
  } = headers;
  return [limit, remaining, reset];
}
