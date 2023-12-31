import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useSelector, useDispatch } from 'react-redux'
import * as filterSlice from '../../reducers/filter/filterSlice'

import { ReactComponent as HeartSVG } from '../../assets/heart.svg';
import { ReactComponent as DiamondSVG } from '../../assets/diamond.svg';
import { ReactComponent as ClubSVG } from '../../assets/club.svg';

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

const SizeMap = {
  "R1.8": 'Small',
  "R1.65": "Small",
  "R2.5": "Middle",
  "R3.75": "Big",
  "R6.25": "Big",
  "R2": "Small",
  "R5.45": "Small",
  "R3.65": 'Big',
  "R3.95": 'Big',
  "R2.75": 'Middle',
  "R13.85": 'Big',
  "R4.1": 'Big',
  "R6.9": 'Big',
  "R6.95": 'Small',
  "R6.75": 'Small',
  "R26.65": 'Big',
  "R13.55": 'Big',
  "R7.15": 'Big',
  "R7.8": 'Big',
  'R7.4': 'Small',
  "R14.85": 'Big',
  "R7.6": 'Big',
  "R10.9": "Big",
  "R21.45": "Big",
  "R27.3": "Big",
  "R29.25": "Big",
  "R10.4": "Small",
  "R20.75": "Middle",
  "R3": "Middle",
  "R3.05": "Middle",
  "R4.6": "Big",
  "R31.1": "Big",
  "R4.5": "Big",
  "R7.5": "Big"
}


const getCategory = (data) => {
  const { Small, Big } = data
  if (Small >= 80) {
    return 'Small'
  } else if (Big >= 80) {
    return 'Big'
  } else if (Small > Big) {
    if (Small - Big >= 20) {
      return 'Small Most, Big Some'
    } else {
      return 'Big, Small'
    }
  } else if (Big > Small) {
    if (Big - Small >= 20) {
      return 'Big Most, Small Some'
    } else {
      return 'Big, Small'
    }
  } 

  return 'Unknown'
}


const getGroupMap = (data) => {
  const groupMap = {
    '80': [],
    '60': [],
    '40': [],
    '20': [],
    '0': []
  }
  data.forEach(d => {
    const check = d.actions.find(a => a.action_code === 'X')
    const freq = 100 - (check.frequency * 100)
    if (freq >= 80) {
      groupMap['80'] = [...groupMap['80'], d]
    } else if (freq >= 60) {
      groupMap['60'] = [...groupMap['60'], d]
    } else if (freq >= 40) {
      groupMap['40'] = [...groupMap['40'], d]
    } else if (freq >= 20) {
      groupMap['20'] = [...groupMap['20'], d]
    } else if (freq >= 0) {
      groupMap['0'] = [...groupMap['0'], d]
    }
  })
  Object.entries(groupMap).forEach(([key, value]) => {
    groupMap[key] = groupMap[key]
      .map(d => {
        const result = {}

        d.actions.forEach((a) => {
          if (a.action_code === 'X' || a.action_code === 'RAI') return
          
          if (SizeMap[a.action_code] === 'Middle') {
            result['Small'] = (result['Small'] || 0) + (a.frequency * 100 / 2)
            result['Big'] = (result['Big'] || 0) + (a.frequency * 100 / 2)
          } else {
            result[SizeMap[a.action_code]] = (result[SizeMap[a.action_code]] || 0) + (a.frequency * 100)
          }

        })
        const total = Object.values(result).reduce((cal, val) => cal + val, 0)
        Object.entries(result).forEach(([rKey, rValue]) => {
          result[rKey] = (result[rKey]/total) * 100
        })
        const category = getCategory(result)
        return {
          ...d,
          summary: result,
          category
        }
      })
  })
  return groupMap;
}

const Wrapper = styled.div`
	top: 100px;
	left: 10%;
	width: 300px;
	height: ${({ data }) => data.length ? '1000px' : '700px'};
	display: flex;
	position: absolute;
	flex-direction: column;
	background: rgb(79, 79, 79);
	border-radius: 5px;
`

const Text = styled.div`
	color: ${({ color }) => color};
	display: flex;
	margin: 5px;
	> * {
		width: 15px;
		font-size: 20px;
	}
`

const Item = styled.div`
	display: flex;
	flex-direction: row;
	flex-wrap: no-wrap;
	align-items: center;
	justify-content: center;
`

const Field = styled.fieldset`
	display: flex;
	flex-direction: row;
	> div {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
`


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

const getSVG = (text) => {
	switch (text) {
    case 'h':
      return <HeartSVG fill="#EF5350"/>;
    case 'd':
      return <DiamondSVG fill="#448AFF" />;
    case 'c':
      return <ClubSVG fill="#66BB6A"/>;
    default:
      return <HeartSVG fill="#EF5350" />;
  }
}

const CardMap = {
	'A': 1,
	'K': 13,
	'Q': 12,
	'J': 11,
	'T': 10,
	'9': 9,
	'8': 8,
	'7': 7,
	'6': 6,
	'5': 5,
	'4': 4,
	'3': 3,
	'2': 2
}

const FreqKeyMap = {
  '80': '80% - 100%',
  '60': '60% - 80%',
  '40': '40% - 60%',
  '20': '20% - 40%',
  '0': '0% - 20%'
}
const CardList = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2']
const FreqList = ['80', '60', '40', '20', '0'];
const SizeList = ['Big', 'Big Most, Small Some', 'Big, Small', 'Small Most, Big Some', 'Small']


function findCompletedStraightPossibilities(cards) {
	for (let card1 = 1; card1 <= 13; card1++) {
		for (let card2 = card1 + 1; card2 <= 13; card2++) {
				const playerCards = [card1, card2];
				const allCards = cards.concat(playerCards);
				allCards.sort((a, b) => a - b);

				for (let i = 0; i <= allCards.length - 5; i++) {
						if (
								allCards[i] + 1 === allCards[i + 1] &&
								allCards[i + 1] + 1 === allCards[i + 2] &&
								allCards[i + 2] + 1 === allCards[i + 3] &&
								allCards[i + 3] + 1 === allCards[i + 4]
						) {
								return true;
						}
				}
		}
	}
	return false
}

function generateCombinations(arr, k) {
  const result = [];

  function combine(start, selected) {
    if (selected.length === k) {
      result.push([...selected]);
      return;
    }

    for (let i = start; i < arr.length; i++) {
      selected.push(arr[i]);
      combine(i + 1, selected);
      selected.pop();
    }
  }

  combine(0, []);
  return result;
}

function isStraight(combination) {
	combination.sort((a, b) => a - b);
	for (let i = 0; i < combination.length - 1; i++) {
		if (combination[i + 1] - combination[i] !== 1) {
			return false;
		}
	}
	return true;
}

function findOESDPossibilities(publicCards) {
  const allCombinations = generateCombinations(publicCards, 2);

  for (const combination of allCombinations) {
    const possibleOESD = [...publicCards, ...combination];
    possibleOESD.sort((a, b) => a - b);

    if (hasOESD(possibleOESD)) {
      return possibleOESD;
    }
  }

  return null;
}


function hasOESD(cards) {
  cards.sort((a, b) => a - b);

  for (let i = 0; i < cards.length - 3; i++) {
    if (cards[i + 3] - cards[i] === 3) {
      return true;
    }
  }

  return false;
}



const FilterModal = ({ onSave, onCancel, data = [], open = false }) => {
	const state = useSelector((state) => state.filter)
	const {
		suits,
		pair,
		connect,
		high,
		highNot,
		middle,
		middleNot,
		low,
		lowNot,
		freq,
		size
	} = state

  const dispatch = useDispatch()

	const originState = { ...state }

	const handleDefault = () => {
		dispatch(filterSlice.reset())
	}

	useEffect(() => {
		handleSave()
	}, [JSON.stringify(data)])

	const handleSave = () => {
		let finalFlops = [...flops];
		switch (suits) {
			case 'rainbow': {
				finalFlops = finalFlops.filter(f => {
					return [...new Set([f[1], f[3], f[5]])].length === 3
				})
				break;
			}
			case 'two-tone': {
				finalFlops = finalFlops.filter(f => {
					return [...new Set([f[1], f[3], f[5]])].length === 2
				})
				break;
			}
			case 'monotone': {
				finalFlops = finalFlops.filter(f => {
					return [...new Set([f[1], f[3], f[5]])].length === 1
				})
				break;
			}
			case 'not-monotone': {
				finalFlops = finalFlops.filter(f => {
					return [...new Set([f[1], f[3], f[5]])].length !== 1
				})
				break;
			}
			default: {

			}
		}
		switch (pair) {
			case 'not': {
				finalFlops = finalFlops.filter(f => {
					return [...new Set([f[0], f[2], f[4]])].length === 3
				})
				break;
			}
			case 'paired': {
				finalFlops = finalFlops.filter(f => {
					return [...new Set([f[0], f[2], f[4]])].length === 2
				})
				break;
			}
			case 'tripled': {
				finalFlops = finalFlops.filter(f => {
					return [...new Set([f[0], f[2], f[4]])].length === 1
				})
				break;
			}
			case 'top-paired': {
				finalFlops = finalFlops.filter(f => {
					return f[0] === f[2] && f[0] !== f[4]
				})
				break;
			}
			case 'bottom-paired': {
				finalFlops = finalFlops.filter(f => {
					return f[2] === f[4] && f[2] !== f[0]
				})
				break;
			}
			default: {
				
			}
		}
		switch (connect) {
			case 'disconnect': {
				finalFlops = finalFlops.filter((f) => {
					return !(findCompletedStraightPossibilities([CardMap[f[0]], CardMap[f[2]], CardMap[f[4]]]) || findOESDPossibilities([CardMap[f[0]], CardMap[f[2]], CardMap[f[4]]]));
				})
				break;
			}
			case 'oesd': {
				finalFlops = finalFlops.filter((f) => {
					return findOESDPossibilities([CardMap[f[0]], CardMap[f[2]], CardMap[f[4]]]);
				})
				break;
			}
			case 'connect': {
				finalFlops = finalFlops.filter((f) => {
					return findCompletedStraightPossibilities([CardMap[f[0]], CardMap[f[2]], CardMap[f[4]]]);
				})
				break;
			}
			default: {
				
			}
		}
		if (high !== 'any') {
			finalFlops = finalFlops.filter((f) => {
				return high.includes(f[0]) 
			})
		}
		if (middle !== 'any') {
			finalFlops = finalFlops.filter((f) => {
				return middle.includes(f[2]) 
			})
		}
		if (low !== 'any') {
			finalFlops = finalFlops.filter((f) => {
				return low.includes(f[4]) 
			})
		}
		if (highNot.length) {
			finalFlops = finalFlops.filter(f => {
				return !highNot.includes(f[0])
			})
		}
		if (middleNot.length) {
			finalFlops = finalFlops.filter(f => {
				return !middleNot.includes(f[2])
			})
		}
		if (lowNot.length) {
			finalFlops = finalFlops.filter(f => {
				return !lowNot.includes(f[4])
			})
		}

		if (data.length) {
			if (freq !== 'any') {
				finalFlops = finalFlops.filter(f => {
					const fl = newData.find(d => d.flop === f);
					return freq.includes(fl.freq)
				})
			}
			if (size !== 'any') {
				finalFlops = finalFlops.filter(f => {
					const fl = newData.find(d => d.flop === f);
					return size.includes(fl.size)
				})
			}
		}

		dispatch(filterSlice.set({ ...state, flops: finalFlops }))
		onSave({
			flops: finalFlops
		})
	}

	const handleCancel = () => {
		dispatch(filterSlice.set(originState))
		onCancel();
	}

	const newData = [...data]
	const groupMap = getGroupMap(newData)
	const flopWithData = newData.map(f => f.flop)
  flopWithData.forEach((flop, i) => {
    Object.entries(groupMap).forEach(([key, value]) => {
      const answer = value.find(v => v.flop === flop)
      if (answer) {
        newData[i] = {
					...newData[i],
          freq: key,
          size: answer.category
        }
        return
      }
    })
  }) 

  return open === true ? (
		<Wrapper data={data}>
			<Field>
				<legend>Suits</legend>
				<Item>
					<input defaultChecked type="radio" name="suits" value="any" onChange={(e) => dispatch(filterSlice.set({ ...state, suits: e.target.value }))} checked={suits === 'any'}/>
					<label for="suits">Any</label>
				</Item>
				<Item>
					<input type="radio" name="suits" value="rainbow" onChange={(e) => dispatch(filterSlice.set({ ...state, suits: e.target.value }))}  checked={suits === 'rainbow'} />
					<label for="suits">Rainbow</label>
				</Item>
				<Item>
					<input type="radio" name="suits" value="two-tone" onChange={(e) => dispatch(filterSlice.set({ ...state, suits: e.target.value }))}  checked={suits === 'two-tone'}/>
					<label for="suits">Two Tone</label>
				</Item>
				<Item>
					<input type="radio" name="suits" value="monotone" onChange={(e) => dispatch(filterSlice.set({ ...state, suits: e.target.value }))}  checked={suits === 'monotone'} />
					<label for="suits">Monotone</label>
				</Item>
				<Item>
					<input type="radio" name="suits" value="not-monotone" onChange={(e) => dispatch(filterSlice.set({ ...state, suits: e.target.value }))}  checked={suits === 'not-monotone'} />
					<label for="suits">Not Monotone</label>
				</Item>
			</Field>
			<Field>
				<legend>Pairing</legend>
				<Item>
					<input defaultChecked type="radio" name="pairing" value="any" onChange={(e) => dispatch(filterSlice.set({ ...state, pair: e.target.value }))}  checked={pair === 'any'} />
					<label for="pairing">Any</label>
				</Item>
				<Item>
					<input type="radio" name="pairing" value="not" onChange={(e) => dispatch(filterSlice.set({ ...state, pair: e.target.value }))} checked={pair === 'not'} />
					<label for="pairing">Not Paired</label>
				</Item>
				<Item>
					<input type="radio" name="pairing" value="paired" onChange={(e) => dispatch(filterSlice.set({ ...state, pair: e.target.value }))}   checked={pair === 'paired'}/>
					<label for="pairing">Paired</label>
				</Item>
				<Item>
					<input type="radio" name="pairing" value="tripled" onChange={(e) => dispatch(filterSlice.set({ ...state, pair: e.target.value }))} checked={pair === 'tripled'} />
					<label for="pairing">Tripled</label>
				</Item>
				<Item>
					<input type="radio" name="pairing" value="top-paired" onChange={(e) => dispatch(filterSlice.set({ ...state, pair: e.target.value }))} checked={pair === 'top-paired'} />
					<label for="pairing">Top Paired</label>
				</Item>
				<Item>
					<input type="radio" name="pairing" value="bottom-paired" onChange={(e) => dispatch(filterSlice.set({ ...state, pair: e.target.value }))} checked={pair === 'bottom-paired'} />
					<label for="pairing">Bottom Paired</label>
				</Item>
			</Field>
			<Field>
				<legend>Connect</legend>
				<Item>
					<input defaultChecked type="radio" name="connect" value="any" onChange={(e) => dispatch(filterSlice.set({ ...state, connect: e.target.value }))}  checked={connect === 'any'} />
					<label for="connect">Any</label>
				</Item>
				<Item>
					<input type="radio" name="connect" value="disconnect" onChange={(e) => dispatch(filterSlice.set({ ...state, connect: e.target.value }))}   checked={connect === 'disconnect'}  />
					<label for="connect">Disconnect</label>
				</Item>
				<Item>
					<input type="radio" name="connect" value="oesd"  onChange={(e) => dispatch(filterSlice.set({ ...state, connect: e.target.value }))}    checked={connect === 'oesd'} />
					<label for="connect">OESD</label>
				</Item>
				<Item>
					<input type="radio" name="connect" value="connect" onChange={(e) => dispatch(filterSlice.set({ ...state, connect: e.target.value }))} checked={connect === 'connect'}  />
					<label for="connect">Connect</label>
				</Item>
			</Field>
			<Field>
				<legend>High</legend>
				<div>
					<Item>
						<input defaultChecked type="checkbox" name="high" value="any"  onChange={(e) => dispatch(filterSlice.set({ ...state, high: e.target.value }))}   checked={high === 'any'}  />
						<label for="high">Any</label>
					</Item>
					{
						CardList.map(c => {
							return <Item>
								<input type="checkbox" name="high" value={c} checked={high !== 'any' && high.includes(c)}
									onChange={(e) => {
										if (high === 'any') {
											dispatch(filterSlice.set({ ...state, high: [c] }))
										} else {
											if (high.includes(c)) {
												dispatch(filterSlice.set({ ...state, high: high.filter(h => h !== c) }))
											} else {
												dispatch(filterSlice.set({ ...state, high: [...high, c] }))
											}
										}
									}}
								/>
								<label for="high">{c}</label>
							</Item>
						})
					}
				</div>
				<div>
					<label>Not</label>
					{
						CardList.map(c => {
							return <Item>
								<input type="checkbox" name="high-not" value={c} checked={highNot.includes(c)}
									onChange={(e) => {
										if (highNot.includes(c)) {
											dispatch(filterSlice.set({ ...state, highNot: highNot.filter(h => h !== c) }))
										} else {
											dispatch(filterSlice.set({ ...state, highNot: [...highNot, c] }))
										}
									}}
								/>
								<label for="high-not">{c}</label>
							</Item>
						})
					}
				</div>
			</Field>
			<Field>
				<legend>Middle</legend>
				<div>
					<Item>
						<input defaultChecked type="checkbox" name="middle" value="any" onChange={(e) => dispatch(filterSlice.set({ ...state, middle: e.target.value }))} checked={middle === 'any'}    />
						<label for="middle">Any</label>
					</Item>
					{
						CardList.map(c => {
							return <Item>
								<input type="checkbox" name="middle" value={c} checked={middle !== 'any' && middle.includes(c)}
									onChange={(e) => {
										if (middle === 'any') {
											dispatch(filterSlice.set({ ...state, middle: [c] }))
										} else {
											if (middle.includes(c)) {
												dispatch(filterSlice.set({ ...state, middle: middle.filter(h => h !== c) }))
											} else {
												dispatch(filterSlice.set({ ...state, middle: [...middle, c] }))
											}
										}
									}}
								/>
								<label for="middle">{c}</label>
							</Item>
						})
					}
				</div>
				<div>
					<label>Not</label>
					{
						CardList.map(c => {
							return <Item>
								<input type="checkbox" name="middle-not" value={c} checked={middleNot.includes(c)}
									onChange={(e) => {
										if (middleNot.includes(c)) {
											dispatch(filterSlice.set({ ...state, middleNot: middleNot.filter(h => h !== c) }))
										} else {
											dispatch(filterSlice.set({ ...state, middleNot: [...middleNot, c] }))
										}
									}}
								/>
								<label for="middle-not">{c}</label>
							</Item>
						})
					}
				</div>
			</Field>
			<Field>
				<legend>Low</legend>
				<div>
					<Item>
						<input defaultChecked type="checkbox" name="low" value="any" onChange={(e) => dispatch(filterSlice.set({ ...state, low: e.target.value }))} checked={low === 'any'}  />
						<label for="low">Any</label>
					</Item>
					{
						CardList.map(c => {
							return <Item>
								<input type="checkbox" name="low" value={c} checked={low !== 'any' && low.includes(c)}
									onChange={(e) => {
										if (low === 'any') {
											dispatch(filterSlice.set({ ...state, low:[c] }))
										} else {
											if (low.includes(c)) {
												dispatch(filterSlice.set({ ...state, low: low.filter(h => h !== c) }))
											} else {
												dispatch(filterSlice.set({ ...state, low: [...low, c] }))
											}
										}
									}}
								/>
								<label for="low">{c}</label>
							</Item>
						})
					}
				</div>
				<div>
					<label>Not</label>
					{
						CardList.map(c => {
							return <Item>
								<input type="checkbox" name="low-not" value={c} checked={lowNot.includes(c)}
									onChange={(e) => {
										if (lowNot.includes(c)) {
											dispatch(filterSlice.set({ ...state, lowNot: lowNot.filter(h => h !== c) }))
										} else {
											dispatch(filterSlice.set({ ...state, lowNot: [...lowNot, c] }))
										}
									}}
								/>
								<label for="low-not">{c}</label>
							</Item>
						})
					}
				</div>
			</Field>
			{
				data.length !== 0 ?	<Field>
					<legend>Frequency</legend>
					<Item>
						<input defaultChecked type="checkbox" name="freq" value="any" onChange={(e) => dispatch(filterSlice.set({ ...state, freq: e.target.value }))}   checked={freq === 'any'}  />
						<label for="freq">Any</label>
					</Item>
					{
						FreqList.map(c => {
							return <Item>
								<input type="checkbox" name="freq" value={c} checked={freq !== 'any' && freq.includes(c)}
									onChange={(e) => {
										if (freq === 'any') {
											dispatch(filterSlice.set({ ...state, freq:[c] }))
										} else {
											if (freq.includes(c)) {
												dispatch(filterSlice.set({ ...state, freq: freq.filter(h => h !== c) }))
											} else {
												dispatch(filterSlice.set({ ...state, freq: [...freq, c] }))
											}
										}
									}}
								/>
								<label for="freq">{FreqKeyMap[c]}</label>
							</Item>
						})
					}
				</Field> : null
			}
			{
				data.length !== 0 ?	<Field>
					<legend>Size</legend>
					<Item>
						<input defaultChecked type="checkbox" name="size" value="any" onChange={(e) => dispatch(filterSlice.set({ ...state, size: e.target.value }))}   checked={size === 'any'}  />
						<label for="size">Any</label>
					</Item>
					{
						SizeList.map(c => {
							return <Item>
								<input type="checkbox" name="size" value={c} checked={size !== 'any' && size.includes(c)}
									onChange={(e) => {
										if (size === 'any') {
											dispatch(filterSlice.set({ ...state, size:[c] }))
										} else {
											if (size.includes(c)) {
												dispatch(filterSlice.set({ ...state, size: size.filter(h => h !== c) }))
											} else {
												dispatch(filterSlice.set({ ...state, size: [...size, c] }))
											}
										}
									}}
								/>
								<label for="size">{c}</label>
							</Item>
						})
					}
				</Field> : null
			}
			<div style={{ display: 'flex', justifyContent: 'space-between' }}>
				<button onClick={handleCancel}>Cancel</button>
				<button onClick={handleDefault}>Default</button>
				<button onClick={handleSave}>Confirm</button>
			</div>
		</Wrapper>
	) : null
}

export default FilterModal;