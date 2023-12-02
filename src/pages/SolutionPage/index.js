import * as d3 from "d3";
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Select, { components } from "react-select";
import { useLocation } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux'
import * as settingSlice from '../../reducers/setting/settingSlice'
import * as preflopSlice from '../../reducers/preflop/preflopSlice'

import { ReactComponent as HeartSVG } from '../../assets/heart.svg';
import { ReactComponent as DiamondSVG } from '../../assets/diamond.svg';
import { ReactComponent as ClubSVG } from '../../assets/club.svg';
import { ReactComponent as SpadeSVG } from '../../assets/spade.svg';


import FilterModal from '../../components/modal/FilterModal'
import Loading from '../../components/Loading'

import SolutionRangePage from './SolutionRangePage';
import SolutionStrategyPage from './SolutionStrategyPage';

import INDEX_MAP from '../../indexMap.json';
// import DATA from './solutions/NL50GG'
import DATA from './solutions'
// import DATA from './solutions/A42.json'


const flops = [
	"2h2d2c",
	"3h2h2d",
	"3h2d2c",
	"3h3d2h",
	"3d3c2h",
	"3h3d3c",
	"4h2h2d",
	"4h2d2c",
	"4h3h2h",
	"4h3h2d",
	"4h3d2h",
	"4d3h2h",
	"4h3d2c",
	"4h3h3d",
	"4h3d3c",
	"4h4d2h",
	"4d4c2h",
	"4h4d3h",
	"4d4c3h",
	"4h4d4c",
	"5h2h2d",
	"5h2d2c",
	"5h3h2h",
	"5d3h2h",
	"5h3h2d",
	"5h3d2h",
	"5h3d2c",
	"5h3h3d",
	"5h3d3c",
	"5h4h2h",
	"5h4h2d",
	"5h4d2h",
	"5d4h2h",
	"5h4d2c",
	"5h4h3h",
	"5d4h3h",
	"5h4h3d",
	"5h4d3h",
	"5h4d3c",
	"5h4h4d",
	"5h4d4c",
	"5h5d2h",
	"5d5c2h",
	"5h5d3h",
	"5d5c3h",
	"5h5d4h",
	"5d5c4h",
	"5h5d5c",
	"6h2h2d",
	"6h2d2c",
	"6h3h2h",
	"6d3h2h",
	"6h3h2d",
	"6h3d2h",
	"6h3d2c",
	"6h3h3d",
	"6h3d3c",
	"6h4h2h",
	"6d4h2h",
	"6h4h2d",
	"6h4d2h",
	"6h4d2c",
	"6h4h3h",
	"6d4h3h",
	"6h4h3d",
	"6h4d3h",
	"6h4d3c",
	"6h4h4d",
	"6h4d4c",
	"6h5h2h",
	"6h5d2h",
	"6h5h2d",
	"6d5h2h",
	"6h5d2c",
	"6h5h3h",
	"6h5h3d",
	"6h5d3h",
	"6d5h3h",
	"6h5d3c",
	"6h5h4h",
	"6d5h4h",
	"6h5h4d",
	"6h5d4h",
	"6h5d4c",
	"6h5h5d",
	"6h5d5c",
	"6h6d2h",
	"6d6c2h",
	"6h6d3h",
	"6d6c3h",
	"6h6d4h",
	"6d6c4h",
	"6h6d5h",
	"6d6c5h",
	"6h6d6c",
	"7h2h2d",
	"7h2d2c",
	"7h3h2h",
	"7h3d2h",
	"7d3h2h",
	"7h3h2d",
	"7h3d2c",
	"7h3h3d",
	"7h3d3c",
	"7h4h2h",
	"7h4h2d",
	"7d4h2h",
	"7h4d2h",
	"7h4d2c",
	"7h4h3h",
	"7d4h3h",
	"7h4h3d",
	"7h4d3h",
	"7h4d3c",
	"7h4h4d",
	"7h4d4c",
	"7h5h2h",
	"7d5h2h",
	"7h5d2h",
	"7h5h2d",
	"7h5d2c",
	"7h5h3h",
	"7d5h3h",
	"7h5d3h",
	"7h5h3d",
	"7h5d3c",
	"7h5h4h",
	"7d5h4h",
	"7h5d4h",
	"7h5h4d",
	"7h5d4c",
	"7h5h5d",
	"7h5d5c",
	"7h6h2h",
	"7h6h2d",
	"7d6h2h",
	"7h6d2h",
	"7h6d2c",
	"7h6h3h",
	"7h6h3d",
	"7d6h3h",
	"7h6d3h",
	"7h6d3c",
	"7h6h4h",
	"7d6h4h",
	"7h6d4h",
	"7h6h4d",
	"7h6d4c",
	"7h6h5h",
	"7h6d5h",
	"7h6h5d",
	"7d6h5h",
	"7h6d5c",
	"7h6h6d",
	"7h6d6c",
	"7h7d2h",
	"7d7c2h",
	"7h7d3h",
	"7d7c3h",
	"7h7d4h",
	"7d7c4h",
	"7h7d5h",
	"7d7c5h",
	"7h7d6h",
	"7d7c6h",
	"7h7d7c",
	"8h2h2d",
	"8h2d2c",
	"8h3h2h",
	"8h3d2h",
	"8h3h2d",
	"8d3h2h",
	"8h3d2c",
	"8h3h3d",
	"8h3d3c",
	"8h4h2h",
	"8h4h2d",
	"8d4h2h",
	"8h4d2h",
	"8h4d2c",
	"8h4h3h",
	"8h4d3h",
	"8h4h3d",
	"8d4h3h",
	"8h4d3c",
	"8h4h4d",
	"8h4d4c",
	"8h5h2h",
	"8d5h2h",
	"8h5d2h",
	"8h5h2d",
	"8h5d2c",
	"8h5h3h",
	"8h5h3d",
	"8h5d3h",
	"8d5h3h",
	"8h5d3c",
	"8h5h4h",
	"8h5h4d",
	"8h5d4h",
	"8d5h4h",
	"8h5d4c",
	"8h5h5d",
	"8h5d5c",
	"8h6h2h",
	"8h6d2h",
	"8h6h2d",
	"8d6h2h",
	"8h6d2c",
	"8h6h3h",
	"8d6h3h",
	"8h6d3h",
	"8h6h3d",
	"8h6d3c",
	"8h6h4h",
	"8d6h4h",
	"8h6h4d",
	"8h6d4h",
	"8h6d4c",
	"8h6h5h",
	"8h6d5h",
	"8h6h5d",
	"8d6h5h",
	"8h6d5c",
	"8h6h6d",
	"8h6d6c",
	"8h7h2h",
	"8d7h2h",
	"8h7h2d",
	"8h7d2h",
	"8h7d2c",
	"8h7h3h",
	"8d7h3h",
	"8h7d3h",
	"8h7h3d",
	"8h7d3c",
	"8h7h4h",
	"8h7d4h",
	"8d7h4h",
	"8h7h4d",
	"8h7d4c",
	"8h7h5h",
	"8h7d5h",
	"8d7h5h",
	"8h7h5d",
	"8h7d5c",
	"8h7h6h",
	"8h7d6h",
	"8d7h6h",
	"8h7h6d",
	"8h7d6c",
	"8h7h7d",
	"8h7d7c",
	"8h8d2h",
	"8d8c2h",
	"8h8d3h",
	"8d8c3h",
	"8h8d4h",
	"8d8c4h",
	"8h8d5h",
	"8d8c5h",
	"8h8d6h",
	"8d8c6h",
	"8h8d7h",
	"8d8c7h",
	"8h8d8c",
	"9h2h2d",
	"9h2d2c",
	"9h3h2h",
	"9h3d2h",
	"9h3h2d",
	"9d3h2h",
	"9h3d2c",
	"9h3h3d",
	"9h3d3c",
	"9h4h2h",
	"9h4h2d",
	"9h4d2h",
	"9d4h2h",
	"9h4d2c",
	"9h4h3h",
	"9d4h3h",
	"9h4h3d",
	"9h4d3h",
	"9h4d3c",
	"9h4h4d",
	"9h4d4c",
	"9h5h2h",
	"9h5d2h",
	"9h5h2d",
	"9d5h2h",
	"9h5d2c",
	"9h5h3h",
	"9h5d3h",
	"9h5h3d",
	"9d5h3h",
	"9h5d3c",
	"9h5h4h",
	"9h5h4d",
	"9d5h4h",
	"9h5d4h",
	"9h5d4c",
	"9h5h5d",
	"9h5d5c",
	"9h6h2h",
	"9d6h2h",
	"9h6h2d",
	"9h6d2h",
	"9h6d2c",
	"9h6h3h",
	"9d6h3h",
	"9h6h3d",
	"9h6d3h",
	"9h6d3c",
	"9h6h4h",
	"9d6h4h",
	"9h6h4d",
	"9h6d4h",
	"9h6d4c",
	"9h6h5h",
	"9d6h5h",
	"9h6d5h",
	"9h6h5d",
	"9h6d5c",
	"9h6h6d",
	"9h6d6c",
	"9h7h2h",
	"9h7d2h",
	"9d7h2h",
	"9h7h2d",
	"9h7d2c",
	"9h7h3h",
	"9h7h3d",
	"9h7d3h",
	"9d7h3h",
	"9h7d3c",
	"9h7h4h",
	"9d7h4h",
	"9h7d4h",
	"9h7h4d",
	"9h7d4c",
	"9h7h5h",
	"9h7h5d",
	"9d7h5h",
	"9h7d5h",
	"9h7d5c",
	"9h7h6h",
	"9d7h6h",
	"9h7d6h",
	"9h7h6d",
	"9h7d6c",
	"9h7h7d",
	"9h7d7c",
	"9h8h2h",
	"9d8h2h",
	"9h8d2h",
	"9h8h2d",
	"9h8d2c",
	"9h8h3h",
	"9h8h3d",
	"9h8d3h",
	"9d8h3h",
	"9h8d3c",
	"9h8h4h",
	"9d8h4h",
	"9h8h4d",
	"9h8d4h",
	"9h8d4c",
	"9h8h5h",
	"9h8h5d",
	"9d8h5h",
	"9h8d5h",
	"9h8d5c",
	"9h8h6h",
	"9d8h6h",
	"9h8h6d",
	"9h8d6h",
	"9h8d6c",
	"9h8h7h",
	"9h8d7h",
	"9h8h7d",
	"9d8h7h",
	"9h8d7c",
	"9h8h8d",
	"9h8d8c",
	"9h9d2h",
	"9d9c2h",
	"9h9d3h",
	"9d9c3h",
	"9h9d4h",
	"9d9c4h",
	"9h9d5h",
	"9d9c5h",
	"9h9d6h",
	"9d9c6h",
	"9h9d7h",
	"9d9c7h",
	"9h9d8h",
	"9d9c8h",
	"9h9d9c",
	"Th2h2d",
	"Th2d2c",
	"Th3h2h",
	"Th3h2d",
	"Th3d2h",
	"Td3h2h",
	"Th3d2c",
	"Th3h3d",
	"Th3d3c",
	"Th4h2h",
	"Td4h2h",
	"Th4d2h",
	"Th4h2d",
	"Th4d2c",
	"Th4h3h",
	"Td4h3h",
	"Th4h3d",
	"Th4d3h",
	"Th4d3c",
	"Th4h4d",
	"Th4d4c",
	"Th5h2h",
	"Th5d2h",
	"Th5h2d",
	"Td5h2h",
	"Th5d2c",
	"Th5h3h",
	"Td5h3h",
	"Th5d3h",
	"Th5h3d",
	"Th5d3c",
	"Th5h4h",
	"Th5h4d",
	"Th5d4h",
	"Td5h4h",
	"Th5d4c",
	"Th5h5d",
	"Th5d5c",
	"Th6h2h",
	"Th6h2d",
	"Th6d2h",
	"Td6h2h",
	"Th6d2c",
	"Th6h3h",
	"Th6h3d",
	"Th6d3h",
	"Td6h3h",
	"Th6d3c",
	"Th6h4h",
	"Th6h4d",
	"Th6d4h",
	"Td6h4h",
	"Th6d4c",
	"Th6h5h",
	"Th6d5h",
	"Td6h5h",
	"Th6h5d",
	"Th6d5c",
	"Th6h6d",
	"Th6d6c",
	"Th7h2h",
	"Th7d2h",
	"Td7h2h",
	"Th7h2d",
	"Th7d2c",
	"Th7h3h",
	"Th7d3h",
	"Td7h3h",
	"Th7h3d",
	"Th7d3c",
	"Th7h4h",
	"Th7h4d",
	"Td7h4h",
	"Th7d4h",
	"Th7d4c",
	"Th7h5h",
	"Th7d5h",
	"Th7h5d",
	"Td7h5h",
	"Th7d5c",
	"Th7h6h",
	"Th7h6d",
	"Th7d6h",
	"Td7h6h",
	"Th7d6c",
	"Th7h7d",
	"Th7d7c",
	"Th8h2h",
	"Th8d2h",
	"Td8h2h",
	"Th8h2d",
	"Th8d2c",
	"Th8h3h",
	"Th8h3d",
	"Th8d3h",
	"Td8h3h",
	"Th8d3c",
	"Th8h4h",
	"Th8d4h",
	"Th8h4d",
	"Td8h4h",
	"Th8d4c",
	"Th8h5h",
	"Th8d5h",
	"Td8h5h",
	"Th8h5d",
	"Th8d5c",
	"Th8h6h",
	"Th8h6d",
	"Td8h6h",
	"Th8d6h",
	"Th8d6c",
	"Th8h7h",
	"Th8d7h",
	"Td8h7h",
	"Th8h7d",
	"Th8d7c",
	"Th8h8d",
	"Th8d8c",
	"Th9h2h",
	"Td9h2h",
	"Th9d2h",
	"Th9h2d",
	"Th9d2c",
	"Th9h3h",
	"Th9h3d",
	"Td9h3h",
	"Th9d3h",
	"Th9d3c",
	"Th9h4h",
	"Td9h4h",
	"Th9d4h",
	"Th9h4d",
	"Th9d4c",
	"Th9h5h",
	"Th9h5d",
	"Th9d5h",
	"Td9h5h",
	"Th9d5c",
	"Th9h6h",
	"Th9d6h",
	"Td9h6h",
	"Th9h6d",
	"Th9d6c",
	"Th9h7h",
	"Td9h7h",
	"Th9d7h",
	"Th9h7d",
	"Th9d7c",
	"Th9h8h",
	"Th9h8d",
	"Th9d8h",
	"Td9h8h",
	"Th9d8c",
	"Th9h9d",
	"Th9d9c",
	"ThTd2h",
	"TdTc2h",
	"ThTd3h",
	"TdTc3h",
	"ThTd4h",
	"TdTc4h",
	"ThTd5h",
	"TdTc5h",
	"ThTd6h",
	"TdTc6h",
	"ThTd7h",
	"TdTc7h",
	"ThTd8h",
	"TdTc8h",
	"ThTd9h",
	"TdTc9h",
	"ThTdTc",
	"Jh2h2d",
	"Jh2d2c",
	"Jh3h2h",
	"Jh3h2d",
	"Jd3h2h",
	"Jh3d2h",
	"Jh3d2c",
	"Jh3h3d",
	"Jh3d3c",
	"Jh4h2h",
	"Jd4h2h",
	"Jh4d2h",
	"Jh4h2d",
	"Jh4d2c",
	"Jh4h3h",
	"Jd4h3h",
	"Jh4d3h",
	"Jh4h3d",
	"Jh4d3c",
	"Jh4h4d",
	"Jh4d4c",
	"Jh5h2h",
	"Jh5h2d",
	"Jd5h2h",
	"Jh5d2h",
	"Jh5d2c",
	"Jh5h3h",
	"Jh5h3d",
	"Jh5d3h",
	"Jd5h3h",
	"Jh5d3c",
	"Jh5h4h",
	"Jh5h4d",
	"Jh5d4h",
	"Jd5h4h",
	"Jh5d4c",
	"Jh5h5d",
	"Jh5d5c",
	"Jh6h2h",
	"Jh6d2h",
	"Jd6h2h",
	"Jh6h2d",
	"Jh6d2c",
	"Jh6h3h",
	"Jh6h3d",
	"Jh6d3h",
	"Jd6h3h",
	"Jh6d3c",
	"Jh6h4h",
	"Jd6h4h",
	"Jh6h4d",
	"Jh6d4h",
	"Jh6d4c",
	"Jh6h5h",
	"Jh6h5d",
	"Jh6d5h",
	"Jd6h5h",
	"Jh6d5c",
	"Jh6h6d",
	"Jh6d6c",
	"Jh7h2h",
	"Jh7h2d",
	"Jh7d2h",
	"Jd7h2h",
	"Jh7d2c",
	"Jh7h3h",
	"Jh7d3h",
	"Jh7h3d",
	"Jd7h3h",
	"Jh7d3c",
	"Jh7h4h",
	"Jd7h4h",
	"Jh7h4d",
	"Jh7d4h",
	"Jh7d4c",
	"Jh7h5h",
	"Jh7d5h",
	"Jd7h5h",
	"Jh7h5d",
	"Jh7d5c",
	"Jh7h6h",
	"Jd7h6h",
	"Jh7h6d",
	"Jh7d6h",
	"Jh7d6c",
	"Jh7h7d",
	"Jh7d7c",
	"Jh8h2h",
	"Jh8h2d",
	"Jh8d2h",
	"Jd8h2h",
	"Jh8d2c",
	"Jh8h3h",
	"Jd8h3h",
	"Jh8h3d",
	"Jh8d3h",
	"Jh8d3c",
	"Jh8h4h",
	"Jh8d4h",
	"Jd8h4h",
	"Jh8h4d",
	"Jh8d4c",
	"Jh8h5h",
	"Jh8h5d",
	"Jh8d5h",
	"Jd8h5h",
	"Jh8d5c",
	"Jh8h6h",
	"Jh8h6d",
	"Jh8d6h",
	"Jd8h6h",
	"Jh8d6c",
	"Jh8h7h",
	"Jd8h7h",
	"Jh8h7d",
	"Jh8d7h",
	"Jh8d7c",
	"Jh8h8d",
	"Jh8d8c",
	"Jh9h2h",
	"Jd9h2h",
	"Jh9d2h",
	"Jh9h2d",
	"Jh9d2c",
	"Jh9h3h",
	"Jh9h3d",
	"Jh9d3h",
	"Jd9h3h",
	"Jh9d3c",
	"Jh9h4h",
	"Jd9h4h",
	"Jh9h4d",
	"Jh9d4h",
	"Jh9d4c",
	"Jh9h5h",
	"Jd9h5h",
	"Jh9h5d",
	"Jh9d5h",
	"Jh9d5c",
	"Jh9h6h",
	"Jh9d6h",
	"Jh9h6d",
	"Jd9h6h",
	"Jh9d6c",
	"Jh9h7h",
	"Jh9h7d",
	"Jd9h7h",
	"Jh9d7h",
	"Jh9d7c",
	"Jh9h8h",
	"Jh9h8d",
	"Jh9d8h",
	"Jd9h8h",
	"Jh9d8c",
	"Jh9h9d",
	"Jh9d9c",
	"JhTh2h",
	"JdTh2h",
	"JhTh2d",
	"JhTd2h",
	"JhTd2c",
	"JhTh3h",
	"JhTh3d",
	"JhTd3h",
	"JdTh3h",
	"JhTd3c",
	"JhTh4h",
	"JdTh4h",
	"JhTh4d",
	"JhTd4h",
	"JhTd4c",
	"JhTh5h",
	"JhTh5d",
	"JhTd5h",
	"JdTh5h",
	"JhTd5c",
	"JhTh6h",
	"JhTh6d",
	"JhTd6h",
	"JdTh6h",
	"JhTd6c",
	"JhTh7h",
	"JdTh7h",
	"JhTd7h",
	"JhTh7d",
	"JhTd7c",
	"JhTh8h",
	"JhTd8h",
	"JhTh8d",
	"JdTh8h",
	"JhTd8c",
	"JhTh9h",
	"JhTd9h",
	"JdTh9h",
	"JhTh9d",
	"JhTd9c",
	"JhThTd",
	"JhTdTc",
	"JhJd2h",
	"JdJc2h",
	"JhJd3h",
	"JdJc3h",
	"JhJd4h",
	"JdJc4h",
	"JhJd5h",
	"JdJc5h",
	"JhJd6h",
	"JdJc6h",
	"JhJd7h",
	"JdJc7h",
	"JhJd8h",
	"JdJc8h",
	"JhJd9h",
	"JdJc9h",
	"JhJdTh",
	"JdJcTh",
	"JhJdJc",
	"Qh2h2d",
	"Qh2d2c",
	"Qh3h2h",
	"Qd3h2h",
	"Qh3d2h",
	"Qh3h2d",
	"Qh3d2c",
	"Qh3h3d",
	"Qh3d3c",
	"Qh4h2h",
	"Qh4d2h",
	"Qh4h2d",
	"Qd4h2h",
	"Qh4d2c",
	"Qh4h3h",
	"Qd4h3h",
	"Qh4h3d",
	"Qh4d3h",
	"Qh4d3c",
	"Qh4h4d",
	"Qh4d4c",
	"Qh5h2h",
	"Qh5h2d",
	"Qd5h2h",
	"Qh5d2h",
	"Qh5d2c",
	"Qh5h3h",
	"Qd5h3h",
	"Qh5h3d",
	"Qh5d3h",
	"Qh5d3c",
	"Qh5h4h",
	"Qh5h4d",
	"Qd5h4h",
	"Qh5d4h",
	"Qh5d4c",
	"Qh5h5d",
	"Qh5d5c",
	"Qh6h2h",
	"Qd6h2h",
	"Qh6d2h",
	"Qh6h2d",
	"Qh6d2c",
	"Qh6h3h",
	"Qh6d3h",
	"Qh6h3d",
	"Qd6h3h",
	"Qh6d3c",
	"Qh6h4h",
	"Qd6h4h",
	"Qh6h4d",
	"Qh6d4h",
	"Qh6d4c",
	"Qh6h5h",
	"Qh6d5h",
	"Qd6h5h",
	"Qh6h5d",
	"Qh6d5c",
	"Qh6h6d",
	"Qh6d6c",
	"Qh7h2h",
	"Qh7d2h",
	"Qh7h2d",
	"Qd7h2h",
	"Qh7d2c",
	"Qh7h3h",
	"Qh7h3d",
	"Qd7h3h",
	"Qh7d3h",
	"Qh7d3c",
	"Qh7h4h",
	"Qh7h4d",
	"Qd7h4h",
	"Qh7d4h",
	"Qh7d4c",
	"Qh7h5h",
	"Qh7d5h",
	"Qh7h5d",
	"Qd7h5h",
	"Qh7d5c",
	"Qh7h6h",
	"Qh7h6d",
	"Qd7h6h",
	"Qh7d6h",
	"Qh7d6c",
	"Qh7h7d",
	"Qh7d7c",
	"Qh8h2h",
	"Qh8h2d",
	"Qh8d2h",
	"Qd8h2h",
	"Qh8d2c",
	"Qh8h3h",
	"Qh8d3h",
	"Qh8h3d",
	"Qd8h3h",
	"Qh8d3c",
	"Qh8h4h",
	"Qh8d4h",
	"Qh8h4d",
	"Qd8h4h",
	"Qh8d4c",
	"Qh8h5h",
	"Qd8h5h",
	"Qh8d5h",
	"Qh8h5d",
	"Qh8d5c",
	"Qh8h6h",
	"Qh8h6d",
	"Qd8h6h",
	"Qh8d6h",
	"Qh8d6c",
	"Qh8h7h",
	"Qd8h7h",
	"Qh8h7d",
	"Qh8d7h",
	"Qh8d7c",
	"Qh8h8d",
	"Qh8d8c",
	"Qh9h2h",
	"Qh9d2h",
	"Qh9h2d",
	"Qd9h2h",
	"Qh9d2c",
	"Qh9h3h",
	"Qh9d3h",
	"Qd9h3h",
	"Qh9h3d",
	"Qh9d3c",
	"Qh9h4h",
	"Qh9h4d",
	"Qd9h4h",
	"Qh9d4h",
	"Qh9d4c",
	"Qh9h5h",
	"Qh9d5h",
	"Qh9h5d",
	"Qd9h5h",
	"Qh9d5c",
	"Qh9h6h",
	"Qd9h6h",
	"Qh9d6h",
	"Qh9h6d",
	"Qh9d6c",
	"Qh9h7h",
	"Qh9d7h",
	"Qd9h7h",
	"Qh9h7d",
	"Qh9d7c",
	"Qh9h8h",
	"Qh9d8h",
	"Qh9h8d",
	"Qd9h8h",
	"Qh9d8c",
	"Qh9h9d",
	"Qh9d9c",
	"QhTh2h",
	"QdTh2h",
	"QhTd2h",
	"QhTh2d",
	"QhTd2c",
	"QhTh3h",
	"QdTh3h",
	"QhTd3h",
	"QhTh3d",
	"QhTd3c",
	"QhTh4h",
	"QhTh4d",
	"QdTh4h",
	"QhTd4h",
	"QhTd4c",
	"QhTh5h",
	"QdTh5h",
	"QhTd5h",
	"QhTh5d",
	"QhTd5c",
	"QhTh6h",
	"QhTh6d",
	"QhTd6h",
	"QdTh6h",
	"QhTd6c",
	"QhTh7h",
	"QhTh7d",
	"QdTh7h",
	"QhTd7h",
	"QhTd7c",
	"QhTh8h",
	"QhTh8d",
	"QdTh8h",
	"QhTd8h",
	"QhTd8c",
	"QhTh9h",
	"QdTh9h",
	"QhTd9h",
	"QhTh9d",
	"QhTd9c",
	"QhThTd",
	"QhTdTc",
	"QhJh2h",
	"QhJd2h",
	"QdJh2h",
	"QhJh2d",
	"QhJd2c",
	"QhJh3h",
	"QhJh3d",
	"QdJh3h",
	"QhJd3h",
	"QhJd3c",
	"QhJh4h",
	"QdJh4h",
	"QhJd4h",
	"QhJh4d",
	"QhJd4c",
	"QhJh5h",
	"QdJh5h",
	"QhJd5h",
	"QhJh5d",
	"QhJd5c",
	"QhJh6h",
	"QdJh6h",
	"QhJd6h",
	"QhJh6d",
	"QhJd6c",
	"QhJh7h",
	"QhJd7h",
	"QdJh7h",
	"QhJh7d",
	"QhJd7c",
	"QhJh8h",
	"QdJh8h",
	"QhJh8d",
	"QhJd8h",
	"QhJd8c",
	"QhJh9h",
	"QhJd9h",
	"QdJh9h",
	"QhJh9d",
	"QhJd9c",
	"QhJhTh",
	"QdJhTh",
	"QhJdTh",
	"QhJhTd",
	"QhJdTc",
	"QhJhJd",
	"QhJdJc",
	"QhQd2h",
	"QdQc2h",
	"QhQd3h",
	"QdQc3h",
	"QhQd4h",
	"QdQc4h",
	"QhQd5h",
	"QdQc5h",
	"QhQd6h",
	"QdQc6h",
	"QhQd7h",
	"QdQc7h",
	"QhQd8h",
	"QdQc8h",
	"QhQd9h",
	"QdQc9h",
	"QhQdTh",
	"QdQcTh",
	"QhQdJh",
	"QdQcJh",
	"QhQdQc",
	"Kh2h2d",
	"Kh2d2c",
	"Kh3h2h",
	"Kd3h2h",
	"Kh3h2d",
	"Kh3d2h",
	"Kh3d2c",
	"Kh3h3d",
	"Kh3d3c",
	"Kh4h2h",
	"Kd4h2h",
	"Kh4d2h",
	"Kh4h2d",
	"Kh4d2c",
	"Kh4h3h",
	"Kh4h3d",
	"Kd4h3h",
	"Kh4d3h",
	"Kh4d3c",
	"Kh4h4d",
	"Kh4d4c",
	"Kh5h2h",
	"Kd5h2h",
	"Kh5d2h",
	"Kh5h2d",
	"Kh5d2c",
	"Kh5h3h",
	"Kh5d3h",
	"Kh5h3d",
	"Kd5h3h",
	"Kh5d3c",
	"Kh5h4h",
	"Kh5h4d",
	"Kh5d4h",
	"Kd5h4h",
	"Kh5d4c",
	"Kh5h5d",
	"Kh5d5c",
	"Kh6h2h",
	"Kh6d2h",
	"Kd6h2h",
	"Kh6h2d",
	"Kh6d2c",
	"Kh6h3h",
	"Kh6d3h",
	"Kh6h3d",
	"Kd6h3h",
	"Kh6d3c",
	"Kh6h4h",
	"Kh6d4h",
	"Kh6h4d",
	"Kd6h4h",
	"Kh6d4c",
	"Kh6h5h",
	"Kd6h5h",
	"Kh6h5d",
	"Kh6d5h",
	"Kh6d5c",
	"Kh6h6d",
	"Kh6d6c",
	"Kh7h2h",
	"Kh7d2h",
	"Kh7h2d",
	"Kd7h2h",
	"Kh7d2c",
	"Kh7h3h",
	"Kh7d3h",
	"Kh7h3d",
	"Kd7h3h",
	"Kh7d3c",
	"Kh7h4h",
	"Kh7h4d",
	"Kd7h4h",
	"Kh7d4h",
	"Kh7d4c",
	"Kh7h5h",
	"Kh7h5d",
	"Kd7h5h",
	"Kh7d5h",
	"Kh7d5c",
	"Kh7h6h",
	"Kd7h6h",
	"Kh7d6h",
	"Kh7h6d",
	"Kh7d6c",
	"Kh7h7d",
	"Kh7d7c",
	"Kh8h2h",
	"Kh8h2d",
	"Kh8d2h",
	"Kd8h2h",
	"Kh8d2c",
	"Kh8h3h",
	"Kd8h3h",
	"Kh8h3d",
	"Kh8d3h",
	"Kh8d3c",
	"Kh8h4h",
	"Kh8d4h",
	"Kh8h4d",
	"Kd8h4h",
	"Kh8d4c",
	"Kh8h5h",
	"Kd8h5h",
	"Kh8d5h",
	"Kh8h5d",
	"Kh8d5c",
	"Kh8h6h",
	"Kd8h6h",
	"Kh8d6h",
	"Kh8h6d",
	"Kh8d6c",
	"Kh8h7h",
	"Kh8d7h",
	"Kh8h7d",
	"Kd8h7h",
	"Kh8d7c",
	"Kh8h8d",
	"Kh8d8c",
	"Kh9h2h",
	"Kd9h2h",
	"Kh9d2h",
	"Kh9h2d",
	"Kh9d2c",
	"Kh9h3h",
	"Kh9d3h",
	"Kd9h3h",
	"Kh9h3d",
	"Kh9d3c",
	"Kh9h4h",
	"Kh9h4d",
	"Kd9h4h",
	"Kh9d4h",
	"Kh9d4c",
	"Kh9h5h",
	"Kh9d5h",
	"Kd9h5h",
	"Kh9h5d",
	"Kh9d5c",
	"Kh9h6h",
	"Kh9h6d",
	"Kh9d6h",
	"Kd9h6h",
	"Kh9d6c",
	"Kh9h7h",
	"Kh9d7h",
	"Kd9h7h",
	"Kh9h7d",
	"Kh9d7c",
	"Kh9h8h",
	"Kh9d8h",
	"Kh9h8d",
	"Kd9h8h",
	"Kh9d8c",
	"Kh9h9d",
	"Kh9d9c",
	"KhTh2h",
	"KdTh2h",
	"KhTd2h",
	"KhTh2d",
	"KhTd2c",
	"KhTh3h",
	"KdTh3h",
	"KhTd3h",
	"KhTh3d",
	"KhTd3c",
	"KhTh4h",
	"KhTd4h",
	"KhTh4d",
	"KdTh4h",
	"KhTd4c",
	"KhTh5h",
	"KhTh5d",
	"KdTh5h",
	"KhTd5h",
	"KhTd5c",
	"KhTh6h",
	"KhTd6h",
	"KdTh6h",
	"KhTh6d",
	"KhTd6c",
	"KhTh7h",
	"KhTd7h",
	"KdTh7h",
	"KhTh7d",
	"KhTd7c",
	"KhTh8h",
	"KhTd8h",
	"KdTh8h",
	"KhTh8d",
	"KhTd8c",
	"KhTh9h",
	"KhTd9h",
	"KdTh9h",
	"KhTh9d",
	"KhTd9c",
	"KhThTd",
	"KhTdTc",
	"KhJh2h",
	"KdJh2h",
	"KhJh2d",
	"KhJd2h",
	"KhJd2c",
	"KhJh3h",
	"KhJd3h",
	"KhJh3d",
	"KdJh3h",
	"KhJd3c",
	"KhJh4h",
	"KhJh4d",
	"KdJh4h",
	"KhJd4h",
	"KhJd4c",
	"KhJh5h",
	"KdJh5h",
	"KhJd5h",
	"KhJh5d",
	"KhJd5c",
	"KhJh6h",
	"KhJh6d",
	"KhJd6h",
	"KdJh6h",
	"KhJd6c",
	"KhJh7h",
	"KhJd7h",
	"KhJh7d",
	"KdJh7h",
	"KhJd7c",
	"KhJh8h",
	"KhJh8d",
	"KhJd8h",
	"KdJh8h",
	"KhJd8c",
	"KhJh9h",
	"KhJd9h",
	"KhJh9d",
	"KdJh9h",
	"KhJd9c",
	"KhJhTh",
	"KdJhTh",
	"KhJhTd",
	"KhJdTh",
	"KhJdTc",
	"KhJhJd",
	"KhJdJc",
	"KhQh2h",
	"KdQh2h",
	"KhQd2h",
	"KhQh2d",
	"KhQd2c",
	"KhQh3h",
	"KhQh3d",
	"KhQd3h",
	"KdQh3h",
	"KhQd3c",
	"KhQh4h",
	"KhQh4d",
	"KdQh4h",
	"KhQd4h",
	"KhQd4c",
	"KhQh5h",
	"KhQd5h",
	"KhQh5d",
	"KdQh5h",
	"KhQd5c",
	"KhQh6h",
	"KdQh6h",
	"KhQh6d",
	"KhQd6h",
	"KhQd6c",
	"KhQh7h",
	"KdQh7h",
	"KhQh7d",
	"KhQd7h",
	"KhQd7c",
	"KhQh8h",
	"KdQh8h",
	"KhQd8h",
	"KhQh8d",
	"KhQd8c",
	"KhQh9h",
	"KhQh9d",
	"KhQd9h",
	"KdQh9h",
	"KhQd9c",
	"KhQhTh",
	"KdQhTh",
	"KhQdTh",
	"KhQhTd",
	"KhQdTc",
	"KhQhJh",
	"KhQdJh",
	"KdQhJh",
	"KhQhJd",
	"KhQdJc",
	"KhQhQd",
	"KhQdQc",
	"KhKd2h",
	"KdKc2h",
	"KhKd3h",
	"KdKc3h",
	"KhKd4h",
	"KdKc4h",
	"KhKd5h",
	"KdKc5h",
	"KhKd6h",
	"KdKc6h",
	"KhKd7h",
	"KdKc7h",
	"KhKd8h",
	"KdKc8h",
	"KhKd9h",
	"KdKc9h",
	"KhKdTh",
	"KdKcTh",
	"KhKdJh",
	"KdKcJh",
	"KhKdQh",
	"KdKcQh",
	"KhKdKc",
	"Ah2h2d",
	"Ah2d2c",
	"Ah3h2h",
	"Ah3d2h",
	"Ah3h2d",
	"Ad3h2h",
	"Ah3d2c",
	"Ah3h3d",
	"Ah3d3c",
	"Ah4h2h",
	"Ad4h2h",
	"Ah4h2d",
	"Ah4d2h",
	"Ah4d2c",
	"Ah4h3h",
	"Ad4h3h",
	"Ah4d3h",
	"Ah4h3d",
	"Ah4d3c",
	"Ah4h4d",
	"Ah4d4c",
	"Ah5h2h",
	"Ad5h2h",
	"Ah5d2h",
	"Ah5h2d",
	"Ah5d2c",
	"Ah5h3h",
	"Ah5d3h",
	"Ad5h3h",
	"Ah5h3d",
	"Ah5d3c",
	"Ah5h4h",
	"Ah5d4h",
	"Ah5h4d",
	"Ad5h4h",
	"Ah5d4c",
	"Ah5h5d",
	"Ah5d5c",
	"Ah6h2h",
	"Ah6d2h",
	"Ad6h2h",
	"Ah6h2d",
	"Ah6d2c",
	"Ah6h3h",
	"Ah6d3h",
	"Ad6h3h",
	"Ah6h3d",
	"Ah6d3c",
	"Ah6h4h",
	"Ah6h4d",
	"Ah6d4h",
	"Ad6h4h",
	"Ah6d4c",
	"Ah6h5h",
	"Ah6d5h",
	"Ah6h5d",
	"Ad6h5h",
	"Ah6d5c",
	"Ah6h6d",
	"Ah6d6c",
	"Ah7h2h",
	"Ah7h2d",
	"Ad7h2h",
	"Ah7d2h",
	"Ah7d2c",
	"Ah7h3h",
	"Ah7d3h",
	"Ad7h3h",
	"Ah7h3d",
	"Ah7d3c",
	"Ah7h4h",
	"Ah7h4d",
	"Ah7d4h",
	"Ad7h4h",
	"Ah7d4c",
	"Ah7h5h",
	"Ah7h5d",
	"Ah7d5h",
	"Ad7h5h",
	"Ah7d5c",
	"Ah7h6h",
	"Ah7d6h",
	"Ah7h6d",
	"Ad7h6h",
	"Ah7d6c",
	"Ah7h7d",
	"Ah7d7c",
	"Ah8h2h",
	"Ah8h2d",
	"Ah8d2h",
	"Ad8h2h",
	"Ah8d2c",
	"Ah8h3h",
	"Ah8h3d",
	"Ad8h3h",
	"Ah8d3h",
	"Ah8d3c",
	"Ah8h4h",
	"Ad8h4h",
	"Ah8h4d",
	"Ah8d4h",
	"Ah8d4c",
	"Ah8h5h",
	"Ah8h5d",
	"Ad8h5h",
	"Ah8d5h",
	"Ah8d5c",
	"Ah8h6h",
	"Ah8h6d",
	"Ah8d6h",
	"Ad8h6h",
	"Ah8d6c",
	"Ah8h7h",
	"Ah8d7h",
	"Ah8h7d",
	"Ad8h7h",
	"Ah8d7c",
	"Ah8h8d",
	"Ah8d8c",
	"Ah9h2h",
	"Ad9h2h",
	"Ah9h2d",
	"Ah9d2h",
	"Ah9d2c",
	"Ah9h3h",
	"Ad9h3h",
	"Ah9d3h",
	"Ah9h3d",
	"Ah9d3c",
	"Ah9h4h",
	"Ah9h4d",
	"Ad9h4h",
	"Ah9d4h",
	"Ah9d4c",
	"Ah9h5h",
	"Ah9h5d",
	"Ah9d5h",
	"Ad9h5h",
	"Ah9d5c",
	"Ah9h6h",
	"Ah9d6h",
	"Ah9h6d",
	"Ad9h6h",
	"Ah9d6c",
	"Ah9h7h",
	"Ad9h7h",
	"Ah9h7d",
	"Ah9d7h",
	"Ah9d7c",
	"Ah9h8h",
	"Ah9h8d",
	"Ah9d8h",
	"Ad9h8h",
	"Ah9d8c",
	"Ah9h9d",
	"Ah9d9c",
	"AhTh2h",
	"AhTh2d",
	"AdTh2h",
	"AhTd2h",
	"AhTd2c",
	"AhTh3h",
	"AhTd3h",
	"AdTh3h",
	"AhTh3d",
	"AhTd3c",
	"AhTh4h",
	"AdTh4h",
	"AhTh4d",
	"AhTd4h",
	"AhTd4c",
	"AhTh5h",
	"AdTh5h",
	"AhTh5d",
	"AhTd5h",
	"AhTd5c",
	"AhTh6h",
	"AhTh6d",
	"AdTh6h",
	"AhTd6h",
	"AhTd6c",
	"AhTh7h",
	"AhTd7h",
	"AhTh7d",
	"AdTh7h",
	"AhTd7c",
	"AhTh8h",
	"AhTd8h",
	"AhTh8d",
	"AdTh8h",
	"AhTd8c",
	"AhTh9h",
	"AdTh9h",
	"AhTd9h",
	"AhTh9d",
	"AhTd9c",
	"AhThTd",
	"AhTdTc",
	"AhJh2h",
	"AhJh2d",
	"AhJd2h",
	"AdJh2h",
	"AhJd2c",
	"AhJh3h",
	"AhJd3h",
	"AhJh3d",
	"AdJh3h",
	"AhJd3c",
	"AhJh4h",
	"AdJh4h",
	"AhJh4d",
	"AhJd4h",
	"AhJd4c",
	"AhJh5h",
	"AhJd5h",
	"AhJh5d",
	"AdJh5h",
	"AhJd5c",
	"AhJh6h",
	"AhJd6h",
	"AhJh6d",
	"AdJh6h",
	"AhJd6c",
	"AhJh7h",
	"AhJd7h",
	"AhJh7d",
	"AdJh7h",
	"AhJd7c",
	"AhJh8h",
	"AdJh8h",
	"AhJd8h",
	"AhJh8d",
	"AhJd8c",
	"AhJh9h",
	"AhJd9h",
	"AhJh9d",
	"AdJh9h",
	"AhJd9c",
	"AhJhTh",
	"AhJhTd",
	"AdJhTh",
	"AhJdTh",
	"AhJdTc",
	"AhJhJd",
	"AhJdJc",
	"AhQh2h",
	"AdQh2h",
	"AhQh2d",
	"AhQd2h",
	"AhQd2c",
	"AhQh3h",
	"AdQh3h",
	"AhQd3h",
	"AhQh3d",
	"AhQd3c",
	"AhQh4h",
	"AhQh4d",
	"AhQd4h",
	"AdQh4h",
	"AhQd4c",
	"AhQh5h",
	"AdQh5h",
	"AhQh5d",
	"AhQd5h",
	"AhQd5c",
	"AhQh6h",
	"AhQh6d",
	"AdQh6h",
	"AhQd6h",
	"AhQd6c",
	"AhQh7h",
	"AhQd7h",
	"AhQh7d",
	"AdQh7h",
	"AhQd7c",
	"AhQh8h",
	"AhQh8d",
	"AdQh8h",
	"AhQd8h",
	"AhQd8c",
	"AhQh9h",
	"AdQh9h",
	"AhQh9d",
	"AhQd9h",
	"AhQd9c",
	"AhQhTh",
	"AhQdTh",
	"AhQhTd",
	"AdQhTh",
	"AhQdTc",
	"AhQhJh",
	"AhQhJd",
	"AhQdJh",
	"AdQhJh",
	"AhQdJc",
	"AhQhQd",
	"AhQdQc",
	"AhKh2h",
	"AhKh2d",
	"AdKh2h",
	"AhKd2h",
	"AhKd2c",
	"AhKh3h",
	"AdKh3h",
	"AhKh3d",
	"AhKd3h",
	"AhKd3c",
	"AhKh4h",
	"AdKh4h",
	"AhKh4d",
	"AhKd4h",
	"AhKd4c",
	"AhKh5h",
	"AdKh5h",
	"AhKd5h",
	"AhKh5d",
	"AhKd5c",
	"AhKh6h",
	"AdKh6h",
	"AhKd6h",
	"AhKh6d",
	"AhKd6c",
	"AhKh7h",
	"AhKd7h",
	"AdKh7h",
	"AhKh7d",
	"AhKd7c",
	"AhKh8h",
	"AdKh8h",
	"AhKh8d",
	"AhKd8h",
	"AhKd8c",
	"AhKh9h",
	"AhKd9h",
	"AdKh9h",
	"AhKh9d",
	"AhKd9c",
	"AhKhTh",
	"AhKhTd",
	"AhKdTh",
	"AdKhTh",
	"AhKdTc",
	"AhKhJh",
	"AhKdJh",
	"AhKhJd",
	"AdKhJh",
	"AhKdJc",
	"AhKhQh",
	"AdKhQh",
	"AhKhQd",
	"AhKdQh",
	"AhKdQc",
	"AhKhKd",
	"AhKdKc",
	"AhAd2h",
	"AdAc2h",
	"AhAd3h",
	"AdAc3h",
	"AhAd4h",
	"AdAc4h",
	"AhAd5h",
	"AdAc5h",
	"AhAd6h",
	"AdAc6h",
	"AhAd7h",
	"AdAc7h",
	"AhAd8h",
	"AdAc8h",
	"AhAd9h",
	"AdAc9h",
	"AhAdTh",
	"AdAcTh",
	"AhAdJh",
	"AdAcJh",
	"AhAdQh",
	"AdAcQh",
	"AhAdKh",
	"AdAcKh",
	"AhAdAc"
]

const SolutionReverseMap = {
  'F-F-F-R2.5-F-C': 'SRP.IPA.BTNVSBB',
  'R2.5-F-F-F-F-C': 'SRP.IPA.LJVSBB',
  'F-F-F-F-R3-C': 'SRP.OPA.SBVSBB',
  'F-F-F-R2.5-R10-F-C': '3Bet.OPA.SB3BBTN',
}


const PREFLOP_MAP = {
	'F-F-F-R2.5-F-C': 'BTN VS BB',
	'R2.5-F-F-F-F-C': 'LJ VS BB',
	'F-F-F-F-R3-C': 'SB VS BB',
	'F-F-F-R2.5-R10-F-C': 'SB 3B BTN',
}

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	width: 100%;
`



const Board = styled.div`
	display: flex;
  flex-wrap: wrap;
	width: 100%;
	max-width: 600px;
	padding: 2.5%;
`

const HandDivWrapper = styled.div`
	flex-basis: 7%;
	background: rgb(30, 30, 30);
	color: rgb(245, 245, 245);
	width: 10%;
  aspect-ratio: 1/1;
	display: flex;
	align-items: center;
	justify-content: ${({ isFreq }) => isFreq ? 'center' : 'start'};;
	border: black 1px solid;
	font-size: 0.7em;
	user-select: none;
	filter: ${({ highlight }) => highlight ? 'brightness(100%)' : 'brightness(30%)'};
`

const ColorBlock = styled.div`
	width: ${({ width }) => width}%;
	background: ${({ color }) => color };
	height: 100%;
`

const TextBlock = styled.div`
	position: absolute;
`

const Page = styled.div`
	display: flex;
	flex-direction: column;
	width: 100vw;
`


const SolutionPageControlWrapper = styled.div`
	@media (max-width: 767px) {
		display: flex;
		flex-wrap: wrap;
		> div:nth-child(-n+4) {
			flex: 1 0 48%;
		}
		> div:nth-child(n+5) {
			flex-basis: 100%;
		}
		> *:nth-child(n+5) {
			margin-top: 10px;
			margin-bottom: 10px;
		}
	}
	@media (min-width: 769px) {
		display: flex;
		margin-top: 70px;
	}
`


const SuitCharacter = styled.div`
	color: ${({ color }) => color};
`

const SuitText = styled.div`
	border: 1px solid;
	background: white;
	display: flex;
	padding: 7px;
	> * {
		width: 13px;
		font-size: 15px;
		padding: 2px;
	}
	:hover: {
		background: blue;
	}
`

const SuitTextForInput = styled.div`
	background: white;
	display: flex;
	> * {
		width: 13px;
		font-size: 15px;
		padding: 2px;
	}
	:hover: {
		background: blue;
	}
`

const SolutionPageWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;

	@media (max-width: 767px) {
		flex-wrap: wrap;
	}

	@media (min-width: 768px) {

	}
`

const getSVG = (text) => {
	switch (text) {
    case 'h':
      return <HeartSVG fill="#EF5350"/>;
    case 'd':
      return <DiamondSVG fill="#448AFF" />;
    case 'c':
      return <ClubSVG fill="#66BB6A"/>;
		case 's':
			return <SpadeSVG fill="rgb(80, 79, 79)"/>;
    default:
      return <HeartSVG fill="#EF5350" />;
  }
}

const getColor = (text) => {
  switch (text) {
    case 'h':
      return '#EF5350';
    case 'd':
      return '#448AFF';
    case 'c':
      return '#66BB6A';
    default:
      return 'black';
  }
}

const sortBySize = (a, b) => {
	if (a[0] === 'X') {
		return 1;
	}
	if (b[0] === 'X') {
		return -1;
	}
	if (a[0] === 'RAI') {
		return -1
	}
	if (b[0] === 'RAI') {
		return 1
	}
	return parseFloat(b[0].slice(1)) - parseFloat(a[0].slice(1))
}

const getColors = (number) => {
  switch (number) {
    case 7:
      return ["rgb(106, 26, 26)", "rgb(125, 31, 31)", "rgb(163, 41, 41)", "rgb(202, 50, 50)", "rgb(221, 55, 55)", "rgb(240, 60, 60)", "rgb(90, 185, 102)"]
    case 6:
      return ["rgb(106, 26, 26)", "rgb(125, 31, 31)", "rgb(163, 41, 41)", "rgb(202, 50, 50)", "rgb(240, 60, 60)", "rgb(90, 185, 102)"];
    case 5:
      return ["rgb(106, 26, 26)", "rgb(125, 31, 31)", "rgb(202, 50, 50)", "rgb(240, 60, 60)", "rgb(90, 185, 102)"];
    case 3:
      return ["rgb(125, 31, 31)", "rgb(240, 60, 60)", "rgb(90, 185, 102)"]
    default:
      return []
  }
}
const COLOR_MAP = {
	'R1.8': "rgb(240, 60, 60)",
	'R2': "rgb(240, 60, 60)",
	'R6.95': "rgb(240, 60, 60)",
	'R2.75': "rgb(202, 50, 50)",
	"R3.65": "rgb(202, 50, 50)",
	"R13.85": "rgb(202, 50, 50)",
	"R3.95": "rgb(202, 50, 50)",
	'R4.1': "rgb(163, 41, 41)",
	"R6.9": "rgb(125, 31, 31)",
	"R7.15": "rgb(125, 31, 31)",
	"R7.8": "rgb(125, 31, 31)",
	"R27.3": "rgb(125, 31, 31)",
	"RAI": "rgb(106, 26, 26)",
	"X": "rgb(90, 185, 102)"
}



const RANGE = [
	['AA', 'AKs', 'AQs', 'AJs', 'ATs', 'A9s', 'A8s', 'A7s', 'A6s', 'A5s', 'A4s', 'A3s', 'A2s'],
	['AKo', 'KK', 'KQs', 'KJs', 'KTs', 'K9s', 'K8s', 'K7s', 'K6s', 'K5s', 'K4s', 'K3s', 'K2s'],
	['AQo', 'KQo', 'QQ', 'QJs', 'QTs', 'Q9s', 'Q8s', 'Q7s', 'Q6s', 'Q5s', 'Q4s', 'Q3s', 'Q2s'],
	['AJo', 'KJo', 'QJo', 'JJ', 'JTs', 'J9s', 'J8s', 'J7s', 'J6s', 'J5s', 'J4s', 'J3s', 'J2s'],
	['ATo', 'KTo', 'QTo', 'JTo', 'TT', 'T9s', 'T8s', 'T7s', 'T6s', 'T5s', 'T4s', 'T3s', 'T2s'],
	['A9o', 'K9o', 'Q9o', 'J9o', 'T9o', '99', '98s', '97s', '96s', '95s', '94s', '93s', '92s'],
	['A8o', 'K8o', 'Q8o', 'J8o', 'T8o', '98o', '88', '87s', '86s', '85s', '84s', '83s', '82s'],
	['A7o', 'K7o', 'Q7o', 'J7o', 'T7o', '97o', '87o', '77', '76s', '75s', '74s', '73s', '72s'],
	['A6o', 'K6o', 'Q6o', 'J6o', 'T6o', '96o', '86o', '76o', '66', '65s', '64s', '63s', '62s'],
	['A5o', 'K5o', 'Q5o', 'J5o', 'T5o', '95o', '85o', '75o', '65o', '55', '54s', '53s', '52s'],
	['A4o', 'K4o', 'Q4o', 'J4o', 'T4o', '94o', '84o', '74o', '64o', '54o', '44', '43s', '42s'],
	['A3o', 'K3o', 'Q3o', 'J3o', 'T3o', '93o', '83o', '73o', '63o', '53o', '43o', '33', '32s'],
	['A2o', 'K2o', 'Q2o', 'J2o', 'T2o', '92o', '82o', '72o', '62o', '52o', '42o', '32o', '22'],
]

const ChartWidth = window.innerWidth < 768 ? 350 : 500;
const ChartHeight = window.innerWidth < 768 ? 200 : 250;
const ChartMargin = window.innerWidth < 768 ? { top: 10, right: 10, bottom: 10, left: 20 } : { top: 20, right: 20, bottom: 20, left: 40 };

const BoardOption = ({ innerProps, label }) => {
  return <SuitText {...innerProps}>
		<SuitCharacter color={getColor(label[1])}>{label[0]}</SuitCharacter>
		<SuitCharacter color={getColor(label[1])}>{getSVG(label[1])}</SuitCharacter>
		<SuitCharacter color={getColor(label[3])}>{label[2]}</SuitCharacter>
		<SuitCharacter color={getColor(label[3])}>{getSVG(label[3])}</SuitCharacter>
		<SuitCharacter color={getColor(label[5])}>{label[4]}</SuitCharacter>
		<SuitCharacter color={getColor(label[5])}>{getSVG(label[5])}</SuitCharacter>
  </SuitText>
}

const SingleValue = ({
	children,
  ...props
}) => {
	const label = children
  return (
		<components.SingleValue {...props}>
			<SuitTextForInput>
				<SuitCharacter color={getColor(label[1])}>{label[0]}</SuitCharacter>
				<SuitCharacter color={getColor(label[1])}>{getSVG(label[1])}</SuitCharacter>
				<SuitCharacter color={getColor(label[3])}>{label[2]}</SuitCharacter>
				<SuitCharacter color={getColor(label[3])}>{getSVG(label[3])}</SuitCharacter>
				<SuitCharacter color={getColor(label[5])}>{label[4]}</SuitCharacter>
				<SuitCharacter color={getColor(label[5])}>{getSVG(label[5])}</SuitCharacter>
			</SuitTextForInput>
		</components.SingleValue>
  );
};


const RangePage = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
	const [mouseMode, setMouseMode] = useState('none')
	const [currentCombos, setCurrentCombos] = useState(0)

	const [flopAction, setFlopAction] = useState('X');
	const [board, setBoard] = useState(queryParams.get('board') || 'QhJh7d');
	const [data, setData] = useState(null)
	const [selectedKey, setSelectedKey] = useState('AA')
	const [reportData, setReportData] = useState([])
	const [pageState, setPageState] = useState('range')
	const [detailState, setDetailState] = useState('hands')
	const [filterState, setFilterState] = useState({ type: 'none' })
	const [clickedFilter, setClickedFilter] = useState({ type: 'none' })
	const [selectedSize, setSelectedSize] = useState('none');
	const [strategyMode, setStrategyMode] = useState('complex');
  const [chartData, setChartDate] = useState([10, 25, 18, 32, 12, 7]);
	const [currentPlayer, setCurrentPlayer] = useState(2)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
	const [loading, setLoading] = useState(false)
  const boardSelectorRef = useRef(null);
  const dispatch = useDispatch()
  const chartRef = useRef(null);
  const filteredChartRef = useRef(null);
	const navigate = useNavigate();
	const { flops: filteredFlop } = useSelector((state) => state.filter)
	const settingStore = useSelector((state) => state.setting)
	const preflopStore = useSelector((state) => state.preflop)
	let setting = queryParams.get('setting') || settingStore
	let preflop = queryParams.get('preflop') || preflopStore

	if (preflop.split('.').length === 3) {
		preflop = 'R2.5-F-F-F-F-C';
	}

	if (!DATA[setting]) {
		setting = 'NL500'
	}


	const player1HandData = data && data.players_info[0].simple_hand_counters;
	const player2HandData = data && data.players_info[1].simple_hand_counters;
	const [player1RangeData, setPlayer1RangeData] = useState(RANGE.map(row => {
		return row.map(v => ({ key: v, value : data && player1HandData[v].total_frequency > 0 ? 0 : -1, combo: data && player1HandData[v].total_combos, highlight: true }))
	}))
	const [player2RangeData, setPlayer2RangeData] = useState(RANGE.map(row => {
		return row.map(v => ({ key: v, value : data && player2HandData[v].total_frequency > 0 ? 0 : -1, combo: data && player2HandData[v].total_combos, highlight: true }))
	}))


	const answerCheckFreq = data && data.solutions[0].total_frequency;

	const totalCombos = data && Object.values(data.players_info[1].simple_hand_counters)
		.reduce((cal, val) => {
			return cal + val.total_combos
		}, 0)

	const onHandEnter = useCallback(({ key }) => {
		setSelectedKey(key)
		// setSelectedKey('A3o')
	}, [])

	useEffect(() => {
		if (!data) {
			return;
		}
		let newPlayer1RangeData = RANGE.map(row => {
			return row.map(v => ({ key: v, value : player1HandData[v].total_frequency > 0 ? 0 : -1, combo: player1HandData[v].total_combos, highlight: true }))
		});
		let newPlayer2RangeData = RANGE.map(row => {
			return row.map(v => ({ key: v, value : player2HandData[v].total_frequency > 0 ? 0 : -1, combo: player2HandData[v].total_combos, highlight: true }))
		});
		let index1, index2;
		let player1MappedEQS = [], player2MappedEQS = [];


		const finalState = clickedFilter.type !== 'none' ? clickedFilter : filterState
		const { key, type } = finalState;

		switch (type) {
			case 'hands': {
				index1 = (data.players_info[0].hand_categories.find(c => c.name === key) || { index: -1 }).index 
				newPlayer1RangeData = newPlayer1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.hand_categories_range[i] === index1)
						}
					})
				})
				index2 = (data.players_info[1].hand_categories.find(c => c.name === key) || { index: -1 }).index 
				newPlayer2RangeData = newPlayer2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.hand_categories_range[i] === index2)
						}
					})
				})
				player1MappedEQS = data.players_info[0].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.hand_categories_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				player2MappedEQS = data.players_info[1].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.hand_categories_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				break;
			}
			case 'draw': {
				index1 = (data.players_info[0].draw_categories.find(c => c.name === key) || { index: -1 }).index 
				newPlayer1RangeData = newPlayer1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.draw_categories_range[i] === index1)
						}
					})
				})
				index2 = (data.players_info[1].draw_categories.find(c => c.name === key) || { index: -1 }).index 
				newPlayer2RangeData = newPlayer2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.draw_categories_range[i] === index2)
						}
					})
				})
				player1MappedEQS = data.players_info[0].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.draw_categories_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				player2MappedEQS = data.players_info[1].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.draw_categories_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				break;
			}
			case 'eqs': {
				index1 = (data.players_info[0].equity_buckets.find(c => c.name === key) || { index: -1 }).index 
				newPlayer1RangeData = newPlayer1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.players_info[0].equity_buckets_range[i] === index1)
						}
					})
				})
				index2 = (data.players_info[1].equity_buckets.find(c => c.name === key) || { index: -1 }).index 
				newPlayer2RangeData = newPlayer2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.players_info[1].equity_buckets_range[i] === index2)
						}
					})
				})
				player1MappedEQS = data.players_info[0].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.players_info[0].equity_buckets_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				player2MappedEQS = data.players_info[1].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.players_info[1].equity_buckets_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				break;
			}
			case 'eqa': {
				index1 = (data.players_info[0].equity_buckets_advanced.find(c => c.name === key) || { index: -1 }).index 
				newPlayer1RangeData = newPlayer1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.players_info[0].equity_buckets_advanced_range[i] === index1)
						}
					})
				})
				index2 = (data.players_info[1].equity_buckets_advanced.find(c => c.name === key) || { index: -1 }).index 
				newPlayer2RangeData = newPlayer2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: v.value === -1 ? false : INDEX_MAP[v.key].some(i => data.players_info[1].equity_buckets_advanced_range[i] === index2)
						}
					})
				})
				player1MappedEQS = data.players_info[0].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.players_info[0].equity_buckets_advanced_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				player2MappedEQS = data.players_info[1].hand_eqs
					.map((q, index) => {
						return { value: q, index: data.players_info[1].equity_buckets_advanced_range[index] }
					})
					.filter(d => d.value !== 0)
					.sort((a, b) => a.value - b.value)
				break;
			}
			case 'none':
			default: {
				newPlayer1RangeData = newPlayer1RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: true
						}
					})
				})
				newPlayer2RangeData = newPlayer2RangeData.map((row, x) => {
					return row.map((v, y) => {
						return {
							...v,
							highlight: true
						}
					})
				})
			}
		}

		setPlayer1RangeData(newPlayer1RangeData)
		setPlayer2RangeData(newPlayer2RangeData)

    const width = ChartWidth;
    const height = ChartHeight;
    const margin = ChartMargin;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

		let player1FilteredValue = player1MappedEQS.map(({ value, index }) => {
			return index === index1 ? value * 100 : 0
		})

		let player2FilteredValue = player2MappedEQS.map(({ value, index }) => {
			return index === index2 ? value * 100 : 0
		})
		
		if (pageState === 'range') {
			d3.select(filteredChartRef.current).selectAll('*').remove();
		
			const svg = d3
				.select(filteredChartRef.current)
				.append('svg')
				.attr('width', width)
				.attr('height', height);

			const xScale1 = d3.scaleLinear().domain([0, player1FilteredValue.length - 1]).range([0, innerWidth]);
			const xScale2 = d3.scaleLinear().domain([0, player2FilteredValue.length - 1]).range([0, innerWidth]);
			const yScale1 = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);
			const yScale2 = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);

			svg
				.selectAll('circle.player1')
				.data(player1FilteredValue)
				.enter().append('circle')
				.attr('class', 'player1')
				.attr('cx', (d, i) => xScale1(i))
				.attr('cy', d => d > 0 ? yScale1(d) : -300)
				.attr('r', 5)
				.attr('fill', 'rgb(151, 234, 248)')
				.attr('transform', `translate(${margin.left},${margin.top})`);

			svg
				.selectAll('circle.player2')
				.data(player2FilteredValue)
				.enter().append('circle')
				.attr('class', 'player2')
				.attr('cx', (d, i) => xScale2(i))
				.attr('cy', d => d > 0 ? yScale2(d) : -300)
				.attr('r', 5)
				.attr('fill', 'rgb(37, 179, 54)')
				.attr('transform', `translate(${margin.left},${margin.top})`);
		}
	}, [JSON.stringify(filterState), JSON.stringify(clickedFilter), JSON.stringify(data), pageState, selectedSize])


  useEffect(() => {
		if (!chartRef.current) return;

		let player1Data = data.players_info[0].hand_eqs
			.filter(d => d !== 0)
			.map(d => d * 100).sort((a,b) => a - b)
		let player2Data = data.players_info[1].hand_eqs
			.filter(d => d !== 0)
			.map(d => d * 100).sort((a,b) => a - b)

		const width = ChartWidth;
		const height = ChartHeight;
    const margin = ChartMargin;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
		if (pageState === 'range') {
			d3.select(chartRef.current).selectAll('*').remove();

			const svg = d3
				.select(chartRef.current)
				.append('svg')
				.attr('width', width)
				.attr('height', height);

			const xScale1 = d3.scaleLinear().domain([0, player1Data.length - 1]).range([0, innerWidth]);
			const xScale2 = d3.scaleLinear().domain([0, player2Data.length - 1]).range([0, innerWidth]);
			const yScale1 = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);
			const line1 = d3.line().x((d, i) => xScale1(i)).y((d) => yScale1(d));

			svg
				.append('path')
				.datum(player1Data)
				.attr('transform', `translate(${margin.left},${margin.top})`)
				.attr('fill', 'none')
				.attr('stroke', 'blue')
				.attr('stroke', 'rgb(151, 234, 248)')
				.attr('stroke-width', 2)
				.attr('d', line1);

			const yScale2 = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);
			const line2 = d3.line().x((d, i) => xScale2(i)).y((d) => yScale2(d));

			svg
				.append('path')
				.datum(player2Data)
				.attr('transform', `translate(${margin.left},${margin.top})`)
				.attr('fill', 'none')
				.attr('stroke', 'red')
				.attr('stroke', 'rgb(37, 179, 54)')
				.attr('stroke-width', 2)
				.attr('d', line2);

			const xAxis = d3.axisBottom(d3.scaleLinear().domain([0, 100]).range([0, innerWidth])).tickValues([25,50,75,100]).tickSizeInner(-innerHeight).tickSizeOuter(0).tickPadding(-3)
			const yAxis = d3.axisLeft(yScale1).tickValues([0,25,50,75,100])
			yAxis.tickSize(-5)
			xAxis.tickSize(-5)

			svg
				.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`)
				.call(yAxis)
				.selectAll('text')
				.style('fill', 'white')
				.selectAll('.tick line')
				.style('stroke', 'white');
		
			svg
				.append('g')
				.attr('transform', `translate(${margin.left},${innerHeight + margin.top})`)
				.call(xAxis)
				.selectAll('text')
				.style('fill', 'white')
				.selectAll('.tick line')
				.style('stroke', 'white');
		}
  }, [JSON.stringify(data), pageState]);

	const handleClickFilter = useCallback(({ type, key }) => {
		if (key === clickedFilter.key || type === 'none') {
			setClickedFilter({ type: 'none' })
			setSelectedSize('none')
		} else {
			setClickedFilter({ type, key })
		}
		setFilterState({ type: 'none' })
	}, [])

	const handleClickSize = useCallback((size) => {
		if (selectedSize === size) {
			setSelectedSize('none')
		} else {
			setSelectedSize(size)
		}
	}, [])

	const handleModeClick = useCallback((mode) => {
		setStrategyMode(mode);
		setSelectedSize('none')
	}, [])

	useEffect(() => {
		const fn = async () => {
			try {
				setLoading(true)
				const path = `${process.env.PUBLIC_URL}/solutions/${setting}/${preflop}/${flopAction}/${board}.json`;
				const response = await fetch(path);
				const data = await response.json()
				setLoading(false)
				setData(data)
			} catch (e) {
				setLoading(false)
				console.log(e)
			}
		}
		fn();
	}, [setting, preflop, flopAction, board])

	useEffect(() => {
		if (!filteredFlop.includes(board)) { 
			setBoard(filteredFlop[0])
			navigate(`?board=${filteredFlop[0]}`);
		}
	}, [JSON.stringify(filteredFlop)])

	useEffect(() => {
		if (DATA[setting][preflop] && !DATA[setting][preflop][flopAction]) {
			setFlopAction(Object.keys(DATA[setting][preflop])[0])
		}
	}, [preflop])

	useEffect(() => {
		const fn = async () => {
			try {
				const path = `${process.env.PUBLIC_URL}/reports/${setting}/${SolutionReverseMap[preflop].split('.').join('/')}.json`
        const response = await fetch(path);
				const data = await response.json()
				setReportData(data.results.data)
			} catch (e) {
				console.log(e)
			}
		}
		fn();
	}, [setting, preflop])


	const playerRangeData = currentPlayer === 1 ? player1RangeData : player2RangeData
	const currentHand = data && data.players_info[1].simple_hand_counters[selectedKey]
	// const DetailComp = detailState === 'hands'
	// 	? () => <Hand data={data} indexList={INDEX_MAP[currentHand.name]} hand={selectedKey}></Hand>
	// 	: () => <Filter
	// 		data={data}
	// 		onSelectFilter={({ type, key }) => setFilterState({ type, key })}
	// 		onClickFilter={({ type, key }) => handleClickFilter({ type, key })}
	// 		hand={selectedKey}></Filter>

	const settingOptions = Object.keys(DATA)
		.map(k => ({ value: k, label: k }))

	const preflopOptions = Object.keys(DATA[setting] || DATA[settingOptions[0].value])
		.map(k => ({ value: k, label: PREFLOP_MAP[k] }))

	const flopActionOptions = Object.keys(DATA[setting][preflop] || DATA[setting][preflopOptions[0].value])
		.map(k => ({ value: k, label: k }))

	const boardOptions = filteredFlop
		.map(k => ({ value: k, label: k }))

	if (!data) {
		return <div>Loading</div>
	}

	return (
		<Page>
			<Wrapper>
				<SolutionPageControlWrapper>
					<Select
						defaultValue={settingOptions[0]}
						options={settingOptions}
						onChange={(e) => {
							dispatch(settingSlice.set(e.value))
						}}
						isClearable={false}
						isSearchable={false}
						value={settingOptions.find(o => o.value === setting)}
					/>
					<Select
						defaultValue={preflopOptions[0]}
						options={preflopOptions}
						onChange={(e) => {
							dispatch(preflopSlice.set(e.value))
							navigate(`?preflop=${e.value}`);
							if (DATA[setting][e.value] && !DATA[setting][e.value][flopAction]) {
								setFlopAction(Object.keys(DATA[setting][e.value])[0])
							}
						}}
						isClearable={false}
						isSearchable={false}
						value={preflopOptions.find(o => o.value === preflop)}
					/>
					<Select
						defaultValue={flopActionOptions[0]}
						options={flopActionOptions}
						onChange={(e) => {
							setFlopAction(e.value)
						}}
						isClearable={false}
						isSearchable={false}
						value={flopActionOptions.find(o => o.value === flopAction)}
					/>
					<Select
						defaultValue={boardOptions[0]}
						components={{ Option: BoardOption, SingleValue }}
						options={boardOptions}
						ref={boardSelectorRef}
						onChange={(e) => {
							setBoard(e.value)
							navigate(`?board=${e.value}`);
						}}
						isClearable={false}
						isSearchable={false}
						value={boardOptions.find(o => o.value === board)}
						onMenuOpen={() => {
							setTimeout(() => {
								if (boardSelectorRef.current &&boardSelectorRef.current.menuListRef) {
									const index = boardOptions.findIndex((option) => option.value === board);
									if (boardSelectorRef.current && index !== -1) {
										const menu = boardSelectorRef.current.menuListRef;
										const option = menu.childNodes[index];
							
										if (option) {
											menu.scrollTop = option.offsetTop;
										}
									}
								}
							}, 50)
						}}
						// menuIsOpen={true}
					/>
					<button onClick={() => setPageState('strategy')}>Strategy</button>
					<button onClick={() => setPageState('range')}>Range</button>
					<button
						onClick={() => {
							const list = filteredFlop
							const min = 0;
							const max = list.length - 1
							const index = Math.floor(Math.random() * (max - min + 1)) + min
							const newFlop = list[index]
							setBoard(newFlop)
							navigate(`?board=${newFlop}`);
						}}
					>Random</button>
					<button
						onClick={() => {
							navigate(`/turn-report?board=${board}&preflop=${preflop}&setting=${setting}&flopAction=${flopAction}`);
						}}
					>Turn</button>
					<button onClick={() => setIsFilterModalOpen(true)}>Filter</button>
				</SolutionPageControlWrapper>
				{
					pageState === 'strategy'
						? <SolutionStrategyPage
								data={data}
								player1RangeData={player1RangeData}
								player2RangeData={player2RangeData}
								playerRangeData={playerRangeData}
								currentPlayer={currentPlayer}
								onHandEnter={onHandEnter}
								setDetailState={setDetailState}
								setFilterState={setFilterState}
								chartRef={chartRef}
								filteredChartRef={filteredChartRef}
								selectedKey={selectedKey}
								setClickedFilter={setClickedFilter}
								handleClickFilter={handleClickFilter}
								currentHand={currentHand}
								detailState={detailState}
								setSelectedSize={handleClickSize}
								selectedSize={selectedSize}
								setStrategyMode={handleModeClick}
								strategyMode={strategyMode}
							/>
						: <SolutionRangePage
								data={data}
								player1RangeData={player1RangeData}
								player2RangeData={player2RangeData}
								playerRangeData={playerRangeData}
								currentPlayer={currentPlayer}
								onHandEnter={onHandEnter}
								setDetailState={setDetailState}
								setFilterState={setFilterState}
								chartRef={chartRef}
								filteredChartRef={filteredChartRef}
								selectedKey={selectedKey}
								setClickedFilter={setClickedFilter}
								handleClickFilter={handleClickFilter}
							/>
				}
				<FilterModal
					onCancel={() => setIsFilterModalOpen(false)}
					onSave={({ flops, state }) => {
						setIsFilterModalOpen(false)
					}}
					data={reportData}
					open={isFilterModalOpen}
				/>
			</Wrapper>
			{
				loading ? <Loading /> : null
			}
		</Page>
	)
}

export default RangePage;