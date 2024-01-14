import { RequestHandler } from 'express';
import { BadRequestError } from '../../util/customErrors';
import ClothesService from '../../service/clothes.service';
import SearchClothesRes from '../../type/clothes/searchClothes.res';
import isInEnum from '../../util/isInEnum';
import Category from '../../common/enum/category.enum';
import Season from '../../common/enum/season.enum';

export const searchClothes: RequestHandler = async (req, res, next) => {
  try {
    const { categories, seasons, text } = req.body;

    if (
      (!categories || categories.length === 0) &&
      (!seasons || seasons.length === 0) &&
      (!text || text.trim().length === 0)
    ) {
      throw new BadRequestError('검색 정보를 입력해주세요');
    }

    if (!categories.every((category: string) => isInEnum(category, Category))) {
      throw new BadRequestError(`카테고리 항목이 유효하지 않습니다`);
    }

    if (!seasons.every((season: string) => isInEnum(season, Season))) {
      throw new BadRequestError(`계절 항목이 유효하지 않습니다`);
    }

    const searchResults: SearchClothesRes[] =
      await ClothesService.searchClothes(categories, seasons, text);

    res.json(searchResults);
  } catch (error) {
    next(error);
  }
};
