import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlightPipe'
})
export class HighlightPipePipe implements PipeTransform {

  transform(fullText: string|any, textToFind: string|any): any {
    if(!textToFind) {
      return fullText;
    }

    const regex = new RegExp(textToFind, 'gi');

    return fullText.replace(regex, `<span class= 'highlightText'>$&</span>`);
  }

}
