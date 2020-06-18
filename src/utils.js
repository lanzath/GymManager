module.exports = {
  age: function age(timestamp) {
    /**
     * https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Date/
     * Gera a data de hoje num object date
     */
    const today = new Date();

    // Usando timestamp gera uma data do tipo object date
    const birthDate = new Date(timestamp);

    /**
    * Método getFullYear retorna o valor inteiro de 4 digitos referente ao ano da data especificada
    * Método getFullMonth retorna um valor zero-based referente aos meses (0-11) da data especificada
    */
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();

    const birthMonthNotCame = month < 0;
    const isBirthMonth = month == 0;
    const isTodayLessThanBirthday = today.getDate() < birthDate.getDate()

    if (birthMonthNotCame || isBirthMonth && isTodayLessThanBirthday) {
      age -= 1;
    }

    return age;
  },
  date: timestamp => {
    /**
     * date gera a data de agora num Obect Date
     * year transforma o timestamp no modelo UTC de ano (yyyy)
     * month transforma o timestamp no modelo UTC de mês (mm)
     * day transforma o timestamp no modelo UTC de dia (dd)
     *
     * a função slice sempre pegará os últimos 2 digitos (-2)
     * portanto, removerá o 0 quando os meses forem 10,11 e 12
     * e o manterá para os demais ex.: 01, 02, 06 ...
     *
     * Padrão UTC (YYYY-MM-DD), Ex (Hoje, 2020-06-09)
     */
    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = `0${date.getUTCMonth() + 1}`.slice(-2);
    const day = `0${date.getUTCDate()}`.slice(-2);

    // retorna uma data formatada no modelo UTC(yyyy-mm-dd) utilizando o template string
    return `${year}-${month}-${day}`;
  }
}
