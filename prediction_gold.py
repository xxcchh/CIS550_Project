# -*- coding: utf-8 -*-
"""
this scripts returns the linear prediction models for 2020 gold numbers per country
"""
import pandas as pd
import numpy as np
from pandas.stats.api import ols
import random

df = pd.read_csv('resources/data clean/prediction_gold.csv')
rows = random.sample(df.index, 10)
test = df[df.index.isin(rows)]
test['intercept'] = 1
train = df.drop(rows)

res = ols(y=train['2016'], x=train[['2008Z','2012Z']])
test['pred'] = res.predict()






