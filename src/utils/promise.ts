export const retries = <T>(
  promise: () => Promise<T>,
  retries: number,
  cooldown: number
) => {
  return new Promise<T>((resolve, reject) => {
    const attempt = (remainingAttempts: number) => {
      promise()
        .then(resolve)
        .catch((error) => {
          if (remainingAttempts === 1) {
            reject(error);
          } else {
            setTimeout(() => attempt(remainingAttempts - 1), cooldown);
          }
        });
    };

    attempt(retries);
  });
};
