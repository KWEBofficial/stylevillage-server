import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';
import ClothesService from '../../service/clothes.service';
import GetClothesRes from '../../type/clothes/getClothes.res';
import isInEnum from '../../util/isInEnum';
import Category from '../../common/enum/category.enum';
import Season from '../../common/enum/season.enum';

export const searchClothes: RequestHandler = async (req, res, next) => {
  try {
    const { categories, seasons, name } = req.body;
    if (
      (!categories || categories.length === 0) &&
      (!seasons || seasons.length === 0) &&
      (!name || name.trim().length === 0)
    ) {
      throw new BadRequestError('검색 정보를 입력해주세요');
    }

    if (categories && categories.length !== 0) {
      categories.forEach((element: string | number) => {
        if (!isInEnum(element, Category)) {
          throw new BadRequestError(`${element} 항목이 카테고리에 없습니다.`);
        }
      });
    }

    if (seasons && seasons.length !== 0) {
      seasons.forEach((element: string | number) => {
        if (!isInEnum(element, Season)) {
          throw new BadRequestError(`${element} 항목이 계절에 없습니다.`);
        }
      });
    }

    const searchResults: GetClothesRes[] = await ClothesService.searchClothes(
      categories,
      seasons,
      name,
    );

    res.json(searchResults);
  } catch (error) {
    next(error);
  }
};
