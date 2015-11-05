import { View } from '../bindings/view';
import { bindEvents } from './dom';

document.mozI18n = new View(document);

bindEvents(document.mozI18n);
