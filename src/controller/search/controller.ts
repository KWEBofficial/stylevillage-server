import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';
import ClothesService from '../../service/clothes.service';
import GetClothesRes from '../../type/clothes/getClothes.res';
import isInEnum from '../../util/isInEnum';
import Category from '../../common/enum/category.enum';
import Season from '../../common/enum/season.enum';

export const searchClothes: RequestHandler = async (req, res, next) => {
  try {
    const { categories, seasons, text } = req.query;

    //categories,seasons를 배열type으로. 값이 하나만 들어오면 ['value']로, 안들어오면 빈배열로
    const categoriesArray = Array.isArray(categories)
      ? categories
      : [categories].filter(Boolean);
    const seasonsArray = Array.isArray(seasons)
      ? seasons
      : [seasons].filter(Boolean);

    //text를 String type으로
    const textString = typeof text === 'string' ? text : '';

    if (
      categoriesArray.length === 0 &&
      seasonsArray.length === 0 &&
      textString.length === 0
    ) {
      throw new BadRequestError('검색 정보를 입력해주세요');
    }

    if (
      categoriesArray.some(
        (category) =>
          typeof category !== 'string' || !isInEnum(category, Category),
      )
    ) {
      throw new BadRequestError(`카테고리 항목이 유효하지 않습니다`);
    }

    if (
      seasonsArray.some(
        (season) => typeof season !== 'string' || !isInEnum(season, Season),
      )
    ) {
      throw new BadRequestError(`계절 항목이 유효하지 않습니다`);
    }

    const searchResults: GetClothesRes[] = await ClothesService.searchClothes(
      categoriesArray as Category[],
      seasonsArray as Season[],
      textString,
    );

    res.json(searchResults);
  } catch (error) {
    next(error);
  }
};
