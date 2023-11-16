export const sortByUrl = (firstItem: any, secondItem: any) =>
  firstItem.url && !secondItem.url ? -1 : 1;

export const deleteUrlFromItem = (picture: any) => (currentPic: any) => {
  const pictureWithoutURL = {
    ...currentPic,
    url: '',
    disabledDrag: true,
    disabledReSorted: true,
  };

  return currentPic.key === picture.key ? pictureWithoutURL : currentPic;
};

export const addUrlToItem = (picture: any) => (currentPic: any) => {
  const pictureWithURL = {
    ...currentPic,
    url: 'https://picsum.photos/300/400',
    disabledDrag: false,
    disabledReSorted: false,
  };

  return currentPic.key === picture.key ? pictureWithURL : currentPic;
};
