export const getNom035Prompt = (headcount) => {
  const isSmall = headcount <= 15;
  const isMedium = headcount > 15 && headcount <= 50;
  const isLarge = headcount > 50;

  let prompt = `
A CONTINUACIÓN DE LAS PREGUNTAS ANTERIORES, DEBERÁS REALIZAR LAS SIGUIENTES PREGUNTAS DE LA NOM-035-STPS-2018.

INSTRUCCIONES DE LA NOM-035:
Explica al colaborador que ahora pasaremos a una sección sobre eventos y factores de riesgo en el entorno de trabajo, en cumplimiento con la norma NOM-035.

--- GUÍA DE REFERENCIA I (EVENTOS TRAUMÁTICOS) ---
Para esta sección, el colaborador debe responder SÓLO con "SÍ" o "NO". Internamente guarda las respuestas como "SI" o "NO".

SECCIÓN I.- Acontecimiento traumático severo
¿Ha presenciado o sufrido alguna vez, durante o con motivo del trabajo un acontecimiento como los siguientes:
G1_1. ¿Accidente que tenga como consecuencia la muerte, la pérdida de un miembro o una lesión grave? (variable: ats_1)
G1_2. ¿Asaltos? (variable: ats_2)
G1_3. ¿Actos violentos que derivaron en lesiones graves? (variable: ats_3)
G1_4. ¿Secuestro? (variable: ats_4)
G1_5. ¿Amenazas? (variable: ats_5)
G1_6. ¿Cualquier otro que ponga en riesgo su vida o salud, y/o la de otras personas? (variable: ats_6)

SECCIÓN II.- Recuerdos persistentes sobre el acontecimiento (último mes)
G1_7. ¿Ha tenido recuerdos recurrentes sobre el acontecimiento que le provocan malestares? (variable: ats_7)
G1_8. ¿Ha tenido sueños de carácter recurrente sobre el acontecimiento, que le producen malestar? (variable: ats_8)

SECCIÓN III.- Esfuerzo por evitar circunstancias parecidas o asociadas (último mes)
G1_9. ¿Se ha esforzado por evitar todo tipo de sentimientos, conversaciones o situaciones que le puedan recordar el acontecimiento? (variable: ats_9)
G1_10. ¿Se ha esforzado por evitar todo tipo de actividades, lugares o personas que motivan recuerdos del acontecimiento? (variable: ats_10)
G1_11. ¿Ha tenido dificultad para recordar alguna parte importante del evento? (variable: ats_11)
G1_12. ¿Ha disminuido su interés en sus actividades cotidianas? (variable: ats_12)
G1_13. ¿Se ha sentido usted alejado o distante de los demás? (variable: ats_13)
G1_14. ¿Ha notado que tiene dificultad para expresar sus sentimientos? (variable: ats_14)
G1_15. ¿Ha tenido la impresión de que su vida se va a acortar, que va a morir antes que otras personas o que tiene un futuro limitado? (variable: ats_15)

SECCIÓN IV.- Afectación (último mes)
G1_16. ¿Ha tenido usted dificultades para dormir? (variable: ats_16)
G1_17. ¿Ha estado particularmente irritable o le han dado arranques de coraje? (variable: ats_17)
G1_18. ¿Ha tenido dificultad para concentrarse? (variable: ats_18)
G1_19. ¿Ha estado nervioso o constantemente en alerta? (variable: ats_19)
G1_20. ¿Se ha sobresaltado fácilmente por cualquier cosa? (variable: ats_20)
`;

  if (isMedium) {
    prompt += `
--- GUÍA DE REFERENCIA II (FACTORES DE RIESGO PSICOSOCIAL) ---
Para estas preguntas, utiliza la siguiente escala del 1 al 5 y guarda los números:
1: Nunca
2: Casi nunca
3: Algunas veces
4: Casi siempre
5: Siempre

G2_1. Mi trabajo me exige hacer mucho esfuerzo físico. (variable: g2_1)
G2_2. Me preocupa sufrir un accidente en mi trabajo. (variable: g2_2)
G2_3. Considero que las actividades que realizo son peligrosas. (variable: g2_3)
G2_4. Por la cantidad de trabajo que tengo debo quedarme tiempo adicional a mi turno. (variable: g2_4)
G2_5. Por la cantidad de trabajo que tengo debo trabajar sin parar. (variable: g2_5)
G2_6. Considero que es necesario mantener un ritmo de trabajo acelerado. (variable: g2_6)
G2_7. Mi trabajo exige que esté muy concentrado. (variable: g2_7)
G2_8. Mi trabajo requiere que memorice mucha información. (variable: g2_8)
G2_9. Mi trabajo exige que atienda varios asuntos al mismo tiempo. (variable: g2_9)
G2_10. En mi trabajo soy responsable de cosas de mucho valor. (variable: g2_10)
G2_11. Respondo ante mi jefe por los resultados de toda mi área de trabajo. (variable: g2_11)
G2_12. En mi trabajo me dan órdenes contradictorias. (variable: g2_12)
G2_13. Considero que en mi trabajo me piden hacer cosas innecesarias. (variable: g2_13)
G2_14. Trabajo horas extras más de tres veces a la semana. (variable: g2_14)
G2_15. Mi trabajo me exige laborar en días de descanso, festivos o fines de semana. (variable: g2_15)
G2_16. Considero que el tiempo en el trabajo es mucho y perjudica mis actividades familiares o personales. (variable: g2_16)
G2_17. Pienso en las actividades familiares o personales cuando estoy en mi trabajo. (variable: g2_17)
G2_18. Mi trabajo permite que desarrolle nuevas habilidades. (variable: g2_18)
G2_19. En mi trabajo puedo aspirar a un mejor puesto. (variable: g2_19)
G2_20. Durante mi jornada de trabajo puedo tomar pausas cuando las necesito. (variable: g2_20)
G2_21. Puedo decidir la velocidad a la que realizo mis actividades en mi trabajo. (variable: g2_21)
G2_22. Puedo cambiar el orden de las actividades que realizo en mi trabajo. (variable: g2_22)
G2_23. Me informan con claridad cuáles son mis funciones. (variable: g2_23)
G2_24. Me explican claramente los resultados que debo obtener en mi trabajo. (variable: g2_24)
G2_25. Me informan con quién puedo resolver problemas o asuntos de trabajo. (variable: g2_25)
G2_26. Me permiten asistir a capacitaciones relacionadas con mi trabajo. (variable: g2_26)
G2_27. Recibo capacitación útil para hacer mi trabajo. (variable: g2_27)
G2_28. Mi jefe tiene en cuenta mis puntos de vista y opiniones. (variable: g2_28)
G2_29. Mi jefe ayuda a solucionar los problemas que se presentan en el trabajo. (variable: g2_29)
G2_30. Puedo confiar en mis compañeros de trabajo. (variable: g2_30)
G2_31. Cuando tenemos que realizar trabajo de equipo los compañeros colaboran. (variable: g2_31)
G2_32. Mis compañeros de trabajo me ayudan cuando tengo dificultades. (variable: g2_32)
G2_33. En mi trabajo puedo expresarme libremente sin interrupciones. (variable: g2_33)
G2_34. Recibo críticas constantes a mi persona y/o trabajo. (variable: g2_34)
G2_35. Recibo burlas, calumnias, difamaciones, humillaciones o ridiculizaciones. (variable: g2_35)
G2_36. Se ignora mi presencia o se me excluye de las reuniones de trabajo y en la toma de decisiones. (variable: g2_36)
G2_37. Se manipulan las situaciones de trabajo para hacerme parecer un mal trabajador. (variable: g2_37)
G2_38. Se ignoran mis éxitos laborales y se atribuyen a otros trabajadores. (variable: g2_38)
G2_39. Me bloquean o impiden las oportunidades que tengo para obtener ascenso o mejora en mi trabajo. (variable: g2_39)
G2_40. He presenciado actos de violencia en mi centro de trabajo. (variable: g2_40)

(Si el usuario atiende clientes):
G2_41. Atiendo clientes o usuarios muy enojados. (variable: g2_41)
G2_42. Mi trabajo me exige atender personas muy necesitadas de ayuda o enfermas. (variable: g2_42)
G2_43. Para hacer mi trabajo debo demostrar sentimientos distintos a los míos. (variable: g2_43)

(Si el usuario tiene personal a su mando):
G2_44. Comunican tarde los asuntos de trabajo. (variable: g2_44)
G2_45. Dificultan el logro de los resultados del trabajo. (variable: g2_45)
G2_46. Ignoran las sugerencias para mejorar su trabajo. (variable: g2_46)
`;
  } else if (isLarge) {
    prompt += `
--- GUÍA DE REFERENCIA III (ENTORNO ORGANIZACIONAL) ---
Para estas preguntas, utiliza la siguiente escala del 1 al 5 y guarda los números:
1: Nunca
2: Casi nunca
3: Algunas veces
4: Casi siempre
5: Siempre

G3_1. El espacio donde trabajo me permite realizar mis actividades de manera segura e higiénica. (variable: g3_1)
G3_2. Mi trabajo me exige hacer mucho esfuerzo físico. (variable: g3_2)
G3_3. Me preocupa sufrir un accidente en mi trabajo. (variable: g3_3)
G3_4. Considero que en mi trabajo se aplican las normas de seguridad y salud en el trabajo. (variable: g3_4)
G3_5. Considero que las actividades que realizo son peligrosas. (variable: g3_5)
G3_6. Por la cantidad de trabajo que tengo debo quedarme tiempo adicional a mi turno. (variable: g3_6)
G3_7. Por la cantidad de trabajo que tengo debo trabajar sin parar. (variable: g3_7)
G3_8. Considero que es necesario mantener un ritmo de trabajo acelerado. (variable: g3_8)
G3_9. Mi trabajo exige que esté muy concentrado. (variable: g3_9)
G3_10. Mi trabajo requiere que memorice mucha información. (variable: g3_10)
G3_11. En mi trabajo tengo que tomar decisiones difíciles muy rápido. (variable: g3_11)
G3_12. Mi trabajo exige que atienda varios asuntos al mismo tiempo. (variable: g3_12)
G3_13. En mi trabajo soy responsable de cosas de mucho valor. (variable: g3_13)
G3_14. Respondo ante mi jefe por los resultados de toda mi área de trabajo. (variable: g3_14)
G3_15. En el trabajo me dan órdenes contradictorias. (variable: g3_15)
G3_16. Considero que en mi trabajo me piden hacer cosas innecesarias. (variable: g3_16)
G3_17. Trabajo horas extras más de tres veces a la semana. (variable: g3_17)
G3_18. Mi trabajo me exige laborar en días de descanso, festivos o fines de semana. (variable: g3_18)
G3_19. Considero que el tiempo en el trabajo es mucho y perjudica mis actividades familiares o personales. (variable: g3_19)
G3_20. Debo atender asuntos de trabajo cuando estoy en casa. (variable: g3_20)
G3_21. Pienso en las actividades familiares o personales cuando estoy en mi trabajo. (variable: g3_21)
G3_22. Pienso que mis responsabilidades familiares afectan mi trabajo. (variable: g3_22)
G3_23. Mi trabajo permite que desarrolle nuevas habilidades. (variable: g3_23)
G3_24. En mi trabajo puedo aspirar a un mejor puesto. (variable: g3_24)
G3_25. Durante mi jornada de trabajo puedo tomar pausas cuando las necesito. (variable: g3_25)
G3_26. Puedo decidir cuánto trabajo realizo durante la jornada laboral. (variable: g3_26)
G3_27. Puedo decidir la velocidad a la que realizo mis actividades en mi trabajo. (variable: g3_27)
G3_28. Puedo cambiar el orden de las actividades que realizo en mi trabajo. (variable: g3_28)
G3_29. Los cambios que se presentan en mi trabajo dificultan mi labor. (variable: g3_29)
G3_30. Cuando se presentan cambios en mi trabajo se tienen en cuenta mis ideas o aportaciones. (variable: g3_30)
G3_31. Me informan con claridad cuáles son mis funciones. (variable: g3_31)
G3_32. Me explican claramente los resultados que debo obtener en mi trabajo. (variable: g3_32)
G3_33. Me explican claramente los objetivos de mi trabajo. (variable: g3_33)
G3_34. Me informan con quién puedo resolver problemas o asuntos de trabajo. (variable: g3_34)
G3_35. Me permiten asistir a capacitaciones relacionadas con mi trabajo. (variable: g3_35)
G3_36. Recibo capacitación útil para hacer mi trabajo. (variable: g3_36)
G3_37. Mi jefe ayuda a organizar mejor el trabajo. (variable: g3_37)
G3_38. Mi jefe tiene en cuenta mis puntos de vista y opiniones. (variable: g3_38)
G3_39. Mi jefe me comunica a tiempo la información relacionada con el trabajo. (variable: g3_39)
G3_40. La orientación que me da mi jefe me ayuda a realizar mejor mi trabajo. (variable: g3_40)
G3_41. Mi jefe ayuda a solucionar los problemas que se presentan en el trabajo. (variable: g3_41)
G3_42. Puedo confiar en mis compañeros de trabajo. (variable: g3_42)
G3_43. Entre compañeros solucionamos los problemas de trabajo de forma respetuosa. (variable: g3_43)
G3_44. En mi trabajo me hacen sentir parte del grupo. (variable: g3_44)
G3_45. Cuando tenemos que realizar trabajo de equipo los compañeros colaboran. (variable: g3_45)
G3_46. Mis compañeros de trabajo me ayudan cuando tengo dificultades. (variable: g3_46)
G3_47. Me informan sobre lo que hago bien en mi trabajo. (variable: g3_47)
G3_48. La forma como evalúan mi trabajo en mi centro de trabajo me ayuda a mejorar mi desempeño. (variable: g3_48)
G3_49. En mi centro de trabajo me pagan a tiempo mi salario. (variable: g3_49)
G3_50. El pago que recibo es el que merezco por el trabajo que realizo. (variable: g3_50)
G3_51. Si obtengo los resultados esperados en mi trabajo me recompensan o reconocen. (variable: g3_51)
G3_52. Las personas que hacen bien el trabajo pueden crecer laboralmente. (variable: g3_52)
G3_53. Considero que mi trabajo es estable. (variable: g3_53)
G3_54. En mi trabajo existe continua rotación de personal. (variable: g3_54)
G3_55. Siento orgullo de laborar en este centro de trabajo. (variable: g3_55)
G3_56. Me siento comprometido con mi trabajo. (variable: g3_56)
G3_57. En mi trabajo puedo expresarme libremente sin interrupciones. (variable: g3_57)
G3_58. Recibo críticas constantes a mi persona y/o trabajo. (variable: g3_58)
G3_59. Recibo burlas, calumnias, difamaciones, humillaciones o ridiculizaciones. (variable: g3_59)
G3_60. Se ignora mi presencia o se me excluye de las reuniones de trabajo y en la toma de decisiones. (variable: g3_60)
G3_61. Se manipulan las situaciones de trabajo para hacerme parecer un mal trabajador. (variable: g3_61)
G3_62. Se ignoran mis éxitos laborales y se atribuyen a otros trabajadores. (variable: g3_62)
G3_63. Me bloquean o impiden las oportunidades que tengo para obtener ascenso o mejora en mi trabajo. (variable: g3_63)
G3_64. He presenciado actos de violencia en mi centro de trabajo. (variable: g3_64)

(Si atiende clientes/usuarios):
G3_65. Atiendo clientes o usuarios muy enojados. (variable: g3_65)
G3_66. Mi trabajo me exige atender personas muy necesitadas de ayuda o enfermas. (variable: g3_66)
G3_67. Para hacer mi trabajo debo demostrar sentimientos distintos a los míos. (variable: g3_67)
G3_68. Mi trabajo me exige atender situaciones de violencia. (variable: g3_68)

(Si tiene personal a su mando):
G3_69. Comunican tarde los asuntos de trabajo. (variable: g3_69)
G3_70. Dificultan el logro de los resultados del trabajo. (variable: g3_70)
G3_71. Cooperan poco cuando se necesita. (variable: g3_71)
G3_72. Ignoran las sugerencias para mejorar su trabajo. (variable: g3_72)
`;
  }

  return prompt;
};
