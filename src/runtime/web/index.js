'use strict';

import { Service } from './service';
import { View } from '../../bindings/html/view';

const service = new Service();

navigator.mozI18n = new View(service, document);
